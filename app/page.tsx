"use client";

import { useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./page.module.css";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const LEADERBOARD_ABI = [
  {
    inputs: [{ name: "_score", type: "uint256" }],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Optional: registerPlayer to support future requests
  {
    inputs: [{ name: "_username", type: "string" }],
    name: "registerPlayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT as `0x${string}`) || "0x0000000000000000000000000000000000000000";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Wagmi write + receipt tracking
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Notify Mini App readiness ASAP
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // Bridge on-chain requests from the game (iframe) to the app wallet (wagmi)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "SUBMIT_ONCHAIN_SCORE") {
        const score = Number(data.score);
        const child = iframeRef.current?.contentWindow;
        if (!child) return;

        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Contract not configured" }, window.location.origin);
          return;
        }

        try {
          child.postMessage({ type: "ONCHAIN_STATUS", message: "Requesting wallet confirmation…" }, window.location.origin);
          writeContract({
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: "submitScore",
            args: [BigInt(score)],
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Unknown error";
          child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [writeContract]);

  // Stream tx status back to the iframe
  useEffect(() => {
    const child = iframeRef.current?.contentWindow;
    if (!child) return;
    if (isPending) {
      child.postMessage({ type: "ONCHAIN_STATUS", message: "Waiting for wallet confirmation…" }, window.location.origin);
    }
    if (hash) {
      child.postMessage({ type: "ONCHAIN_HASH", hash }, window.location.origin);
    }
    if (isConfirming) {
      child.postMessage({ type: "ONCHAIN_STATUS", message: "Submitting score to blockchain…" }, window.location.origin);
    }
    if (isConfirmed) {
      child.postMessage({ type: "ONCHAIN_CONFIRMED" }, window.location.origin);
    }
    if (error) {
      const message = (error as unknown) && (error as Error).message ? (error as Error).message : "Transaction error";
      child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
    }
  }, [isPending, hash, isConfirming, isConfirmed, error]);

  return (
    <div className={styles.container}>
      <iframe
        ref={iframeRef}
        src="/eat-grow.html"
        title="Eat & Grow"
        className={styles.frame}
        allow="accelerometer; fullscreen"
      />
    </div>
  );
}
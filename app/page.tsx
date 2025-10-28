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

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`) || "0x0000000000000000000000000000000000000000";

const blockchainEnabled = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENABLED === 'true';

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Wagmi write + receipt tracking - always call hooks, conditionally use results
  const wagmiWriteContract = useWriteContract();
  const wagmiWaitForReceipt = useWaitForTransactionReceipt({ hash: wagmiWriteContract.data });

  const { data: hash, writeContract, isPending, error } = blockchainEnabled ? wagmiWriteContract : {};
  const { isLoading: isConfirming, isSuccess: isConfirmed } = blockchainEnabled ? wagmiWaitForReceipt : {};

  // Notify Mini App readiness ASAP
  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  // Bridge on-chain requests from the game (iframe) to the app wallet (wagmi)
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log('Received message from iframe:', event.data);
      
      if (event.origin !== window.location.origin) {
        console.log('Ignoring message from different origin:', event.origin);
        return;
      }
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "REGISTER_PLAYER") {
        const username = String(data.username || "");
        const child = iframeRef.current?.contentWindow;
        if (!child) return;

        if (!blockchainEnabled || !writeContract) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Blockchain features disabled" }, window.location.origin);
          return;
        }

        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Contract not configured" }, window.location.origin);
          return;
        }

        if (!username.trim()) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Username is required" }, window.location.origin);
          return;
        }

        try {
          child.postMessage({ type: "ONCHAIN_STATUS", message: "Registering player…" }, window.location.origin);
          writeContract({
            address: CONTRACT_ADDRESS,
            abi: LEADERBOARD_ABI,
            functionName: "registerPlayer",
            args: [username.trim()],
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Unknown error";
          child.postMessage({ type: "ONCHAIN_ERROR", message }, window.location.origin);
        }
      }

      if (data.type === "SUBMIT_ONCHAIN_SCORE") {
        const score = Number(data.score);
        const child = iframeRef.current?.contentWindow;
        if (!child) return;

        if (!blockchainEnabled || !writeContract) {
          child.postMessage({ type: "ONCHAIN_ERROR", message: "Blockchain features disabled" }, window.location.origin);
          return;
        }

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
        allow="accelerometer; fullscreen; camera; microphone; geolocation; autoplay; encrypted-media; gyroscope; magnetometer"
      />
    </div>
  );
}
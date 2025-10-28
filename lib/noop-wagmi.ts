/* eslint-disable @typescript-eslint/no-explicit-any */
// Lightweight stubs for wagmi hooks so the app can run in game-only mode
export function useAccount() {
  return { address: undefined as any, isConnected: false as boolean } as any;
}

export function useConnect() {
  return { connect: async () => {}, connectors: [] } as any;
}

export function useDisconnect() {
  return { disconnect: async () => {} } as any;
}

export function useSignMessage() {
  return { signMessageAsync: undefined } as any;
}

export function useWriteContract() {
  return { data: undefined as any, writeContract: undefined as any, isPending: false as boolean, error: undefined as any } as any;
}

export function useReadContract(_opts?: any) {
  return { data: undefined as any, isLoading: false as boolean, refetch: async () => {} } as any;
}

export function useWaitForTransactionReceipt(_opts?: any) {
  return { isLoading: false as boolean, isSuccess: false as boolean } as any;
}

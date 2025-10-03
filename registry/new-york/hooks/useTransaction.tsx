"use client";

import { useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

// Re-export the status type for convenience in other components
export type TransactionStatus = "idle" | "sending" | "confirming" | "success" | "error";

/**
 * A custom hook to manage the lifecycle of a Solana transaction.
 * It handles sending, confirming, and tracking the state of the transaction.
 */
export const useTransaction = () => {
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [txid, setTxid] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Sends and confirms a Solana transaction.
   * @param transaction - The VersionedTransaction or legacy Transaction to send.
   */
  const executeTransaction = useCallback(
    async (transaction: VersionedTransaction | Transaction) => {
      // Reset state before starting a new transaction
      setStatus("sending");
      setTxid(undefined);
      setError(undefined);

      try {
        // --- 1. Send Transaction ---
        // This will prompt the user's wallet to sign and send.
        const signature = await sendTransaction(transaction, connection);
        setTxid(signature);
        console.log(`Transaction Submitted: ${signature}`);

        // --- 2. Change Status to Confirming ---
        setStatus("confirming");
        console.log("Waiting for confirmation...");

        // --- 3. Confirm Transaction ---
        const latestBlockhash = await connection.getLatestBlockhash("confirmed");
        const confirmation = await connection.confirmTransaction(
          {
            signature: signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          },
          "confirmed"
        );

        if (confirmation.value.err) {
          throw new Error(`Transaction failed to confirm: ${JSON.stringify(confirmation.value.err)}`);
        }

        // --- 4. Success ---
        setStatus("success");
        console.log("Transaction Successfully Confirmed!");
        
      } catch (err: any) {
        // --- 5. Handle Errors ---
        console.error(`Transaction failed: ${err.message}`);
        setError(err.message || "An unexpected error occurred.");
        setStatus("error");
      }
    },
    [connection, sendTransaction]
  );
  
  /**
   * Resets the hook's state to its initial idle status.
   */
  const reset = useCallback(() => {
    setStatus("idle");
    setTxid(undefined);
    setError(undefined);
  }, []);

  return { status, txid, error, executeTransaction, reset };
};
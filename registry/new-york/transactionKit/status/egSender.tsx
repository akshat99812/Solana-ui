"use client";

import React, { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Status, TransactionStatus } from "./status";

export const TokenSender = () => {
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [txid, setTxid] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const handleSendTransaction = async () => {
    setStatus("sending");
    setError(undefined);
    setTxid(undefined);

    try {
      console.log("Attempt: Starting Token Transfer Process");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedTxid = "5y5tC6jC2f7g2gK8d...FAKE_SIGNATURE...gHjJkL9mNn2pQrS";
      setTxid(simulatedTxid);
      console.log(`Transaction Submitted: ${simulatedTxid}`);
      
      setStatus("confirming");
      console.log("Waiting for confirmation...");
      await new Promise(resolve => setTimeout(resolve, 4000));

      const shouldFail = Math.random() < 0.2;
      if (shouldFail) {
        throw new Error("Simulation: Transaction not confirmed by the network.");
      }
      setStatus("success");
      console.log("Transaction Successfully Confirmed!");
      
    } catch (err: any) {
      console.error(`Transaction failed with error: ${err.message}`);
      setError(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  
  const handleReset = () => {
    setStatus("idle");
    setTxid(undefined);
    setError(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      {status === "idle" && (
        <Button onClick={handleSendTransaction} size="lg">
          Send 0.01 USDC
        </Button>
      )}
      <Status
        status={status}
        txid={txid}
        error={error}
        onReset={handleReset}
      />
    </div>
  );
};
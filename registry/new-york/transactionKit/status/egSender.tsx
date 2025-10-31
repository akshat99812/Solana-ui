"use client";

import React, { useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Status, TransactionStatus } from "@/registry/new-york/transactionKit/status/status";

export const TokenSender = ({}) => {
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [txid, setTxid] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const handleSendTransactionSuccess = async () => {
    setStatus("sending");
    setError(undefined);
    setTxid(undefined);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedTxid = "5y5tC6jC2f7g2gK8d...FAKE_SIGNATURE...gHjJkL9mNn2pQrS";
      setTxid(simulatedTxid);
      setStatus("confirming");
      await new Promise(resolve => setTimeout(resolve, 4000));
      const shouldFail = Math.random() < 0.2;
      if (shouldFail) {
        throw new Error("Simulation: Transaction not confirmed by the network.");
      }
      setStatus("success"); 
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };
  
  const handleSendTransactionFail = async () => {
    setStatus("sending");
    setError(undefined);
    setTxid(undefined);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedTxid = "5y5tC6jC2f7g2gK8d...FAKE_SIGNATURE...gHjJkL9mNn2pQrS";
      setTxid(simulatedTxid);
      setStatus("confirming");
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      throw new Error("Simulation: Transaction not confirmed by the network.");
      
      setStatus("success");
     
      
    } catch (err: any) {
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
      <div className="my-4">
        {status === "idle" && (
          <Button onClick={handleSendTransactionSuccess} size="lg">
            Example Transaction for succesful Transaction
          </Button>
        )}
        <Status
          status={status}
          txid={txid}
          error={error}
          onReset={handleReset}
        />
      </div>
      <div>
        {status === "idle" && (
          <Button onClick={handleSendTransactionFail} size="lg">
            Example Transaction for Failed Transaction
          </Button>
        )}
      </div>
      
      
    </div>
  );
};
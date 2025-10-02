"use client";

import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert";
import { Card, CardContent, } from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import { LoaderCircle, CheckCircle2, XCircle } from "lucide-react";

export type TransactionStatus = "idle" | "sending" | "confirming" | "success" | "error";

interface SolanaTransactionStatusProps {
  status: TransactionStatus;
  txid?: string;
  error?: string;
  onReset?: () => void;
}

export const Status = ({
  status,
  txid,
  error,
  onReset,
}: SolanaTransactionStatusProps) => {
  if (status === "idle") {
    return null;
  }

  const renderContent = () => {
    switch (status) {
      case "sending":
        return (
          <div className="flex flex-col items-center gap-4 p-6">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Submitting Transaction...</p>
            <p className="text-sm text-muted-foreground">Please approve the transaction in your wallet.</p>
          </div>
        );
      case "confirming":
        return (
          <div className="flex flex-col items-center gap-4 p-6">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Confirming Transaction</p>
            <p className="text-sm text-muted-foreground break-all">
              TxID: {txid ? `${txid.slice(0, 10)}...${txid.slice(-10)}` : "..."}
            </p>
          </div>
        );
      case "success":
        return (
          <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle>Transaction Confirmed!</AlertTitle>
            <AlertDescription className="mt-2">
              Your transfer was successful.
              <a
                href={`https://solscan.io/tx/${txid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-semibold text-green-600 underline"
              >
                View on SolScan
              </a>
            </AlertDescription>
          </Alert>
        );
      case "error":
        return (
          <Alert variant="destructive">
            <XCircle className="h-5 w-5" />
            <AlertTitle>Transaction Failed</AlertTitle>
            <AlertDescription className="mt-2">
              {error || "An unknown error occurred."}
            </AlertDescription>
            {onReset && 
              <div>
                <Button onClick={onReset} variant="secondary">Try Again</Button>
              </div>
              }
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/registry/new-york/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover";
import { Label } from "@/registry/new-york/ui/label";
import { Input } from "@/registry/new-york/ui/input";

const SLIPPAGE_PRESETS = [10, 50, 100]; // 0.1%, 0.5%, 1%
const PRIORITY_FEE_PRESETS = [10000, 50000, 100000]; // Low, Medium, High

// Define the props the component will accept
interface TransactionSettingsProps {
  priorityFee: number;
  slippageBps: number;
  onPriorityFeeChange: (fee: number) => void;
  onSlippageBpsChange: (bps: number) => void;
}

export const TransactionSettings = ({
  priorityFee,
  slippageBps,
  onPriorityFeeChange,
  onSlippageBpsChange,
}: TransactionSettingsProps) => {
  // Local state for the custom input fields remains for a better UX
  const [customSlippage, setCustomSlippage] = useState((slippageBps / 100).toString());
  const [customPriorityFee, setCustomPriorityFee] = useState(priorityFee.toString());

  // Update local input state if the incoming prop changes
  useEffect(() => {
    setCustomSlippage((slippageBps / 100).toString());
    console.log(slippageBps);
  }, [slippageBps]);

  useEffect(() => {
    setCustomPriorityFee(priorityFee.toString());
  }, [priorityFee]);

  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSlippage(value);
    if (value && !isNaN(parseFloat(value))) {
      // Call the callback prop to notify the parent of the change
      onSlippageBpsChange(Math.round(parseFloat(value) * 100));
    }
  };

  const handlePriorityFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPriorityFee(value);
    if (value && !isNaN(parseInt(value))) {
      // Call the callback prop to notify the parent of the change
      onPriorityFeeChange(parseInt(value));
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Transaction Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your transaction settings.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slippage">Slippage Tolerance</Label>
            <div className="flex items-center gap-2">
              {SLIPPAGE_PRESETS.map((bps) => (
                <Button
                  key={bps}
                  variant={slippageBps === bps ? "secondary" : "outline"}
                  className="flex-1"
                  onClick={() => onSlippageBpsChange(bps)}
                >
                  {bps / 100}%
                </Button>
              ))}
              <div className="relative flex-1">
                <Input
                  id="slippage"
                  value={customSlippage}
                  onChange={handleSlippageChange}
                  className="pr-8"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority-fee">Priority Fee</Label>
            <div className="flex items-center gap-2">
              {PRIORITY_FEE_PRESETS.map((fee) => (
                 <Button
                  key={fee}
                  variant={priorityFee === fee ? "secondary" : "outline"}
                  className="flex-1"
                  onClick={() => onPriorityFeeChange(fee)}
                >
                  {fee / 100000}k
                </Button>
              ))}
              <div className="relative flex-1">
                 <Input
                  id="priority-fee"
                  value={customPriorityFee}
                  onChange={handlePriorityFeeChange}
                  className="pr-12"
                />
                 <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">μLp</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
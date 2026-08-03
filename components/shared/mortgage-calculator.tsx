"use client";

import * as React from "react";
import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateMortgage, DEFAULT_RATE } from "@/utils/mortgage";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";

export function MortgageCalculator({ price }: { price: number }) {
  const [down, setDown] = React.useState(Math.round(price * 0.2));
  const [rate, setRate] = React.useState(DEFAULT_RATE);
  const [years, setYears] = React.useState(30);
  const [show, setShow] = React.useState(false);

  const result = React.useMemo(() => calculateMortgage({ price, downPayment: down, rate, years }), [price, down, rate, years]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" /> Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Down payment</Label>
            <Input type="number" value={down} onChange={(e) => setDown(Number(e.target.value) || 0)} min={0} max={price} />
            <p className="text-xs text-muted-foreground">{result.downPercent.toFixed(0)}% of price</p>
          </div>
          <div className="space-y-1.5">
            <Label>Interest rate (%)</Label>
            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} min={0} max={20} />
          </div>
          <div className="space-y-1.5">
            <Label>Loan term</Label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={10}>10 years</option>
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={25}>25 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        </div>

        {show && (
          <div className={cn("animate-fade-up space-y-3 rounded-xl bg-muted/60 p-4")}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated monthly</p>
                <p className="font-display text-3xl font-bold text-primary">{formatPrice(result.monthly, null)}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Principal: {formatPrice(result.principal)}</p>
                <p>Total paid: {formatPrice(result.totalPayment)}</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${Math.min(100, (result.totalPayment / (result.principal * 2)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Total interest: <span className="font-semibold text-foreground">{formatPrice(result.totalInterest)}</span> ·
              Payoff by <span className="font-semibold text-foreground">{result.payoffDate}</span>
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
        >
          {show ? "Hide estimate" : "Estimate my monthly payment"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Estimate only — not a lending offer. Contact a mortgage advisor for exact rates.
        </p>
      </CardContent>
    </Card>
  );
}
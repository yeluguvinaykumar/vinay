"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appointmentSchema } from "@/lib/validations";
import { TIME_SLOTS } from "@/types";
import { cn } from "@/lib/utils";

type BookingValues = z.infer<typeof appointmentSchema>;

export function BookingDialog({
  propertyId,
  propertyTitle,
  open,
  onOpenChange,
}: {
  propertyId?: string;
  propertyTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { propertyId },
  });

  const timeSlot = watch("timeSlot");

  const minDate = new Date().toISOString().split("T")[0];

  const onSubmit = async (values: BookingValues) => {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not book. Please try another time.");
      return;
    }
    toast.success("Visit scheduled!", { description: `Confirmation sent to ${values.email}` });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent" />
            Schedule a Visit
          </DialogTitle>
          <DialogDescription>
            {propertyTitle ? `Book a viewing for "${propertyTitle}".` : "Pick a date and time that works for you."} Our
            agent will confirm by email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bk-name">Full name</Label>
              <Input id="bk-name" placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-phone">Phone</Label>
              <Input id="bk-phone" placeholder="+1 555 000 0000" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bk-email">Email</Label>
              <Input id="bk-email" type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bk-date">Preferred date</Label>
              <Input
                id="bk-date"
                type="date"
                min={minDate}
                {...register("date")}
                onChange={(e) => setValue("date", e.target.value, { shouldValidate: true })}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Time slot</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue("timeSlot", t, { shouldValidate: true })}
                    className={cn(
                      "rounded-lg border px-1 py-1.5 text-xs font-medium transition-colors",
                      timeSlot === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/50 hover:bg-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.timeSlot && <p className="text-xs text-destructive">{errors.timeSlot.message}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bk-msg">Notes (optional)</Label>
              <Textarea id="bk-msg" rows={2} placeholder="Any questions about the property?" {...register("message")} />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            {!isSubmitting && "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
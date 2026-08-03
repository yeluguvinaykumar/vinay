"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { leadSchema } from "@/lib/validations";

type LeadValues = z.infer<typeof leadSchema>;

export function InquiryForm({
  propertyId,
  propertyTitle,
  compact = false,
}: {
  propertyId?: string;
  propertyTitle?: string;
  compact?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { propertyId, source: propertyId ? "property" : "inquiry" },
  });

  const onSubmit = async (values: LeadValues) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Something went wrong. Please try again.");
      return;
    }
    toast.success("Inquiry sent!", { description: "Our team will contact you shortly." });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {propertyTitle && (
        <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          About: <span className="font-semibold text-foreground">{propertyTitle}</span>
        </div>
      )}
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="lead-name">Full name</Label>
          <Input id="lead-name" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead-email">Email</Label>
          <Input id="lead-email" type="email" placeholder="john@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead-phone">Phone (optional)</Label>
          <Input id="lead-phone" placeholder="+1 555 000 0000" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="lead-message">Message</Label>
          <Textarea
            id="lead-message"
            rows={compact ? 3 : 4}
            placeholder="I'm interested in this property. Please contact me."
            {...register("message")}
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
        {!isSubmitting && "Send Inquiry"}
      </Button>
    </form>
  );
}
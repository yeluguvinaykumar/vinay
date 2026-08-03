"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema } from "@/lib/validations";

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterValues) => {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not subscribe. Try again.");
      return;
    }
    toast.success("Subscribed!", { description: "You'll hear from us soon." });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            className="h-11 rounded-xl bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:bg-white/15"
            {...register("email")}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <Button type="submit" variant="gold" className="h-11 rounded-xl px-6" loading={isSubmitting}>
          {!isSubmitting && <Mail className="h-4 w-4" />}
          Subscribe
        </Button>
      </div>
    </form>
  );
}
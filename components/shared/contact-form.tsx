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
import { contactSchema } from "@/lib/validations";

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactValues) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not send your message. Try again.");
      return;
    }
    toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-name">Full name</Label>
          <Input id="ct-name" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-email">Email</Label>
          <Input id="ct-email" type="email" placeholder="john@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ct-phone">Phone (optional)</Label>
          <Input id="ct-phone" placeholder="+1 555 000 0000" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ct-subject">Subject</Label>
          <Input id="ct-subject" placeholder="How can we help?" {...register("subject")} />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ct-message">Message</Label>
        <Textarea id="ct-message" rows={6} placeholder="Tell us a little about what you're looking for…" {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
        {!isSubmitting && "Send Message"}
      </Button>
    </form>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = async (values: { email: string }) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not send reset link");
      return;
    }
    setSent(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-3xl font-extrabold tracking-tight text-primary">VINAY</Link>
          <p className="mt-2 text-sm text-muted-foreground">Reset your password</p>
        </div>

        {sent ? (
          <div className="rounded-2xl border bg-card/80 p-8 text-center shadow-xl backdrop-blur">
            <MailCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h1 className="font-display text-xl font-bold">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If an account exists for that email, we&apos;ve sent a password reset link. It expires in 15 minutes.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur"
            noValidate
          >
            <p className="text-sm text-muted-foreground">
              Enter the email associated with your account and we&apos;ll send you a reset link.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="fp-email">Email</Label>
              <Input id="fp-email" type="email" placeholder="admin@vinay.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>Send Reset Link</Button>
            <p className="text-center text-sm">
              Remembered it?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
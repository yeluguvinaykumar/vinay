"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/lib/validations";

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={null}>
      <ResetForm />
    </React.Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: { token: string; password: string }) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Reset failed");
      return;
    }
    toast.success("Password updated — please sign in");
    router.replace("/login");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-3xl font-extrabold tracking-tight text-primary">VINAY</Link>
          <p className="mt-2 text-sm text-muted-foreground">Choose a new password</p>
        </div>

        {!token ? (
          <div className="rounded-2xl border bg-card/80 p-8 text-center shadow-xl backdrop-blur">
            <KeyRound className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="font-display text-xl font-bold">Invalid reset link</h1>
            <p className="mt-2 text-sm text-muted-foreground">This link is missing its token. Request a new one.</p>
            <Button asChild className="mt-6">
              <Link href="/forgot-password">Request new link</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="rp-pass">New password</Label>
              <Input id="rp-pass" type="password" placeholder="At least 8 characters" autoComplete="new-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rp-confirm">Confirm password</Label>
              <Input id="rp-confirm" type="password" placeholder="Repeat the new password" autoComplete="new-password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>Update Password</Button>
          </form>
        )}
      </div>
    </div>
  );
}
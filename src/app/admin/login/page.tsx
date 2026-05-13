"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/site/auth-shell";
import { Field } from "@/components/site/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "@/lib/store";
import { ShieldCheck } from "lucide-react";

const Schema = z.object({
  password: z.string().min(1, "Required"),
  otp: z.string().length(6, "Enter the 6-digit OTP"),
});

type FormValues = z.infer<typeof Schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setAdmin = useSession((s) => s.setAdmin);
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ kind: "error", title: data.message || "Could not sign in" });
        return;
      }
      setAdmin("admin@elevations247.co.za");
      toast({ kind: "success", title: "Signed in", description: "Welcome back, admin." });
      router.push("/admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Admin sign-in."
      subtitle="Two factors. Password first, then admin OTP."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Admin password" required error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••"
            autoFocus
            {...register("password")}
          />
        </Field>
        <Field
          label="Admin OTP"
          required
          error={errors.otp?.message}
          hint="Demo OTP: 000123"
        >
          <Input
            inputMode="numeric"
            maxLength={6}
            placeholder="000123"
            {...register("otp")}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          <ShieldCheck className="h-4 w-4" />
          {submitting ? "Verifying..." : "Sign in to admin"}
        </Button>
        <div className="rounded-btn border border-line bg-surface p-3 text-xs text-muted">
          Demo: password <span className="font-mono text-ink">420420</span> · OTP{" "}
          <span className="font-mono text-ink">000123</span>
        </div>
      </form>
    </AuthShell>
  );
}

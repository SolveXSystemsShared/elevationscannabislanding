"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/site/auth-shell";
import { Field } from "@/components/site/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { JOIN_URL } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const Schema = z.object({
  identifier: z.string().min(3, "Enter your cell number or email"),
});
type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          kind: "error",
          title: data.message || "Could not sign in",
          description: data.error === "suspended"
            ? "Your account has been suspended. Please contact support."
            : undefined,
        });
        return;
      }
      toast({
        kind: "info",
        title: "OTP sent",
        description: "Check your messages — enter the 6-digit code.",
      });
      router.push(`/verify?uid=${data.member_uid}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Enter your cell number or email — we'll send a one-time code to verify it's you."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field
          label="Cell number or email"
          required
          error={errors.identifier?.message}
        >
          <Input
            placeholder="0823456789 or you@example.co.za"
            autoFocus
            {...register("identifier")}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Sending OTP..." : "Send me a code"}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </Button>
        <p className="text-center text-sm text-muted">
          New here?{" "}
          <a href={JOIN_URL} className="text-purple font-medium hover:underline">
            Become a member — free
          </a>
        </p>
      </form>
    </AuthShell>
  );
}

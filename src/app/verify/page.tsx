"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = React.useRef<HTMLInputElement[]>([]);
  const setRef = (i: number) => (el: HTMLInputElement | null) => {
    if (el) refs.current[i] = el;
  };

  const set = (i: number, ch: string) => {
    const arr = value.split("");
    arr[i] = ch;
    const next = arr.join("").slice(0, 6);
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={setRef(i)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => set(i, e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (pasted) {
              e.preventDefault();
              onChange(pasted);
              refs.current[Math.min(pasted.length, 5)]?.focus();
            }
          }}
          className={cn(
            "h-14 w-12 sm:h-16 sm:w-14 rounded-card border border-line bg-surface text-center font-display text-2xl font-semibold",
            "focus:outline-none focus:border-purple focus:ring-2 focus:ring-purple/30",
            value[i] && "border-purple/40 bg-purple/5",
          )}
        />
      ))}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyInner />
    </React.Suspense>
  );
}

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const uid = params.get("uid") || "";
  const { toast } = useToast();
  const setMember = useSession((s) => s.setMember);
  const [otp, setOtp] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (code = otp) => {
    if (code.length !== 6 || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ member_uid: uid, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ kind: "error", title: data.message || "Verification failed" });
        setOtp("");
        return;
      }
      setMember({
        memberId: data.member.member_id,
        memberUid: data.member.member_uid,
        fullName: data.member.full_name,
        email: data.member.email,
      });
      toast({
        kind: "success",
        title: "You're in.",
        description: "Welcome to the club.",
      });
      router.push("/store");
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (otp.length === 6) submit(otp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!uid) {
    return (
      <AuthShell title="Verification link expired" variant="single">
        <p className="text-muted">
          Start again from the{" "}
          <Link href="/login" className="text-purple underline">
            login page
          </Link>
          .
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Enter your code."
      subtitle="We've sent a 6-digit code to your cell. Enter it below to access the store."
      variant="single"
    >
      <OtpInput value={otp} onChange={setOtp} />
      <p className="mt-5 text-center text-xs text-muted">
        Demo OTP: <span className="font-mono text-purple font-semibold">123456</span>
      </p>
      <Button
        size="lg"
        className="mt-6 w-full"
        onClick={() => submit()}
        disabled={otp.length !== 6 || submitting}
      >
        {submitting ? "Verifying..." : "Verify and Enter"}
      </Button>
      <button
        className="mt-4 mx-auto block text-sm text-muted hover:text-purple"
        onClick={() =>
          toast({
            kind: "info",
            title: "Code resent",
            description: "Check your messages again.",
          })
        }
      >
        Didn&apos;t get the code? <span className="underline">Resend</span>
      </button>
    </AuthShell>
  );
}

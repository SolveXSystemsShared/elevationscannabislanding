"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    q: "Is this legal?",
    a: "Yes. Elevations247 operates as a private members club, grounded in the constitutional right to privacy as affirmed by the Constitutional Court in Minister of Justice v Prince [2018] ZACC 30. Cannabis is exchanged between members as club credits applied toward communal growing and acquisition for personal use by adult members.",
  },
  {
    q: "How does the private club model work?",
    a: "Members register and verify their identity. Membership is free. Once verified, you can place orders that are delivered discreetly. Cannabis is provided to members for their own personal use under the right-to-privacy framework. This is not retail.",
  },
  {
    q: "How do I become a member?",
    a: "Click Join Now, complete the registration form (full name, ID, cell, address, email), accept the membership agreement, and verify your cell number via OTP. You'll be in within minutes. You must be 18 or older and a South African resident.",
  },
  {
    q: "What areas do you deliver to?",
    a: "Stellenbosch only at this stage. We deliver via UberConnect or our preferred courier — fast, plain packaging, no fanfare.",
  },
  {
    q: "How do I pay?",
    a: "All payments are processed securely through Yoco's hosted payment links. We never store your card details. Yoco is a fully PCI-compliant South African payment processor.",
  },
  {
    q: "How long does delivery take?",
    a: "Most Stellenbosch orders arrive within 30–60 minutes. You'll see live status updates from the moment your order is placed until it arrives at your door.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. All member data is handled under POPIA (Protection of Personal Information Act, 2013). We collect only what we need to verify membership and fulfil orders. Your information is encrypted at rest and never shared with anyone except where required by law.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-surface">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-[34px] sm:text-h2 font-semibold leading-tight tracking-tight">
              Frequently asked.
            </h2>
            <p className="mt-3 text-muted text-pretty">
              Everything you might want to know before joining. If something
              isn&apos;t covered, drop us a note at hello@elevations247.co.za.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

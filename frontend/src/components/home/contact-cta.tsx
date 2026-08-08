"use client";

import Link from "next/link";
import { ArrowUpRight, Copy, Check, Mail, Phone } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { TextReveal } from "@/components/motion/text-reveal";
import { PERSON } from "@/constants/site";
import { useCopyToClipboard, useCurrentTime } from "@/hooks";

export function ContactCTA() {
  const { copied, copy } = useCopyToClipboard();
  const time = useCurrentTime(PERSON.timezone);

  return (
    <Section id="contact" className="overflow-hidden">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center sm:p-16 noise">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-aurora animate-aurora" />
          <div className="absolute inset-0 bg-grid opacity-40" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-[var(--success)]" />
            {PERSON.shortLocation} · {time ?? "--:--"}
          </p>

          <TextReveal
            as="h2"
            by="word"
            text="Have something worth building?"
            className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em]"
          />

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I&apos;m open to senior frontend and full-stack roles, and to contract work with
            teams who care about craft. Tell me what you&apos;re building — I read every message.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.3}>
              <Button asChild size="xl" variant="gradient" className="rounded-full">
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </Magnetic>

            <Button
              size="xl"
              variant="outline"
              className="rounded-full"
              onClick={() => copy(PERSON.email)}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Email copied" : PERSON.email}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <a
              href={`mailto:${PERSON.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {PERSON.email}
            </a>
            <a
              href={`tel:${PERSON.phoneRaw}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Phone className="size-4" />
              {PERSON.phone}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

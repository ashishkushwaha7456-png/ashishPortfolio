"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { contactSchema, type ContactInput } from "@/schemas";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  "Full-time role",
  "Contract",
  "Freelance project",
  "Collaboration",
  "Just saying hi",
] as const;

const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not applicable"] as const;

function ContactFormInner() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: intent === "hire" ? "Role opportunity" : "",
      projectType: intent === "hire" ? "Full-time role" : undefined,
      message: "",
      website: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ContactInput) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Could not send your message");
      }
      return json.data;
    },
    onSuccess() {
      setSent(true);
      reset();
      toast.success("Message sent", {
        description: "Thanks — I'll get back to you within a day.",
      });
    },
    onError(error: Error) {
      toast.error("Couldn't send that", { description: error.message });
    },
  });

  const projectType = watch("projectType");
  const budget = watch("budget");
  const messageLength = watch("message")?.length ?? 0;

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center"
      >
        <div className="grid size-14 place-items-center rounded-full bg-[color-mix(in_oklch,var(--success)_15%,transparent)] text-[var(--success)]">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. I read every message and usually reply within a day —
          check your inbox (and spam, occasionally).
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} required>
          <Input
            {...register("name")}
            placeholder="Jane Doe"
            autoComplete="name"
            error={Boolean(errors.name)}
          />
        </Field>

        <Field label="Email" error={errors.email?.message} required>
          <Input
            {...register("email")}
            type="email"
            placeholder="jane@company.com"
            autoComplete="email"
            error={Boolean(errors.email)}
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject?.message} required>
        <Input
          {...register("subject")}
          placeholder="Senior Frontend Engineer role at…"
          error={Boolean(errors.subject)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What's this about?" error={errors.projectType?.message}>
          <Select
            value={projectType}
            onValueChange={(value) =>
              setValue("projectType", value as ContactInput["projectType"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger aria-label="Enquiry type">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Budget (optional)" error={errors.budget?.message}>
          <Select
            value={budget}
            onValueChange={(value) =>
              setValue("budget", value as ContactInput["budget"], { shouldValidate: true })
            }
          >
            <SelectTrigger aria-label="Budget range">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Message"
        error={errors.message?.message}
        required
        hint={`${messageLength} / 4000`}
      >
        <Textarea
          {...register("message")}
          rows={6}
          placeholder="Tell me about the team, the product, and what you're trying to solve…"
          error={Boolean(errors.message)}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">
          Your details are only used to reply. Never shared, never a mailing list.
        </p>
        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="rounded-full"
          loading={isSubmitting || mutation.isPending}
        >
          <Send className="size-4" />
          Send message
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {hint && <span className="font-mono text-[0.6875rem] text-muted-foreground">{hint}</span>}
      </div>

      {/* The child owns its own registration; cloning only wires up the id. */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}

      {error && (
        <p className={cn("text-xs text-destructive")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  return (
    <React.Suspense
      fallback={<div className="h-[38rem] rounded-2xl border border-border bg-card" />}
    >
      <ContactFormInner />
    </React.Suspense>
  );
}

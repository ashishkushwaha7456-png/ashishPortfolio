"use client";

import { Check, Copy, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { useCopyToClipboard } from "@/hooks";
import { absoluteUrl } from "@/lib/utils";

export function ResumeActions({ fileUrl }: { fileUrl: string }) {
  const { copied, copy } = useCopyToClipboard();

  const trackDownload = () => {
    // Fire-and-forget: a failed beacon must never block the download.
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";
    void fetch(`${API_URL}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "download", path: "/resume", meta: { file: fileUrl } }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Magnetic strength={0.28}>
        <Button asChild size="lg" variant="gradient" className="rounded-full">
          <a href={fileUrl} download onClick={trackDownload}>
            <Download className="size-4" />
            Download PDF
          </a>
        </Button>
      </Magnetic>

      <Button
        size="lg"
        variant="outline"
        className="rounded-full"
        onClick={() => window.print()}
      >
        <Printer className="size-4" />
        Print
      </Button>

      <Button
        size="lg"
        variant="ghost"
        className="rounded-full"
        onClick={() => copy(absoluteUrl("/resume"))}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
    </div>
  );
}

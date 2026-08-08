"use client";

import * as React from "react";
import Image from "next/image";
import { AlertTriangle, Check, Copy, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useUpload } from "@/services/admin-client";
import { cn } from "@/lib/utils";
import { useCopyToClipboard, useLocalStorage } from "@/hooks";

interface Asset {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  type: string;
  uploadedAt: string;
  name: string;
}

/**
 * Upload surface plus a local index of what's been uploaded this browser.
 *
 * Cloudinary is the store of record; this list is a convenience so URLs are
 * one click away when filling in a form. It intentionally doesn't try to be a
 * full asset browser — that's Cloudinary's own console.
 */
export function MediaManager({ cloudinaryConfigured }: { cloudinaryConfigured: boolean }) {
  const [assets, setAssets] = useLocalStorage<Asset[]>("admin-media-index", []);
  const [folder, setFolder] = React.useState("uploads");
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const upload = useUpload();
  const { copied, copy } = useCopyToClipboard();
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;

      Array.from(files).forEach((file) => {
        upload.mutate(
          { file, folder },
          {
            onSuccess(result) {
              setAssets((current) => [
                {
                  url: result.url,
                  publicId: result.publicId,
                  width: result.width,
                  height: result.height,
                  type: result.type,
                  name: file.name,
                  uploadedAt: new Date().toISOString(),
                },
                ...current,
              ]);
              toast.success(`Uploaded ${file.name}`);
            },
            onError(error) {
              toast.error(`Couldn't upload ${file.name}`, { description: error.message });
            },
          },
        );
      });
    },
    [folder, upload, setAssets],
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media"
        description="Upload images, video and PDFs, then paste the URL into any content field."
      />

      {!cloudinaryConfigured && (
        <div className="flex flex-col gap-4 rounded-2xl border border-[color-mix(in_oklch,var(--warning)_35%,transparent)] bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-5 sm:flex-row sm:items-center">
          <AlertTriangle className="size-5 shrink-0 text-[var(--warning)]" />
          <div>
            <p className="text-sm font-semibold">Cloudinary isn&apos;t configured</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add <code className="font-mono text-xs">CLOUDINARY_CLOUD_NAME</code>,{" "}
              <code className="font-mono text-xs">CLOUDINARY_API_KEY</code> and{" "}
              <code className="font-mono text-xs">CLOUDINARY_API_SECRET</code> to enable uploads.
              Until then, drop files into <code className="font-mono text-xs">/public</code> and
              reference them by path.
            </p>
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card",
        )}
      >
        {upload.isPending ? (
          <Loader2 className="mx-auto size-7 animate-spin text-primary" />
        ) : (
          <UploadCloud className="mx-auto size-7 text-muted-foreground" />
        )}

        <p className="mt-4 font-display text-lg font-semibold">
          {upload.isPending ? "Uploading…" : "Drop files here"}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          PNG, JPG, WebP, AVIF, SVG, MP4 or PDF · up to 12MB each
        </p>

        <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-2">
          <Input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="Folder"
            aria-label="Upload folder"
            className="h-9 w-40"
          />
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending || !cloudinaryConfigured}
          >
            Choose files
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Index */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Uploaded from this browser
            {assets.length > 0 && (
              <span className="ml-2 font-normal text-muted-foreground">({assets.length})</span>
            )}
          </h2>
          {assets.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setAssets([])}>
              Clear list
            </Button>
          )}
        </div>

        {assets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing uploaded yet. Files you add here will be listed for quick reuse.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => (
              <li
                key={asset.url}
                className="group overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  {asset.type === "image" && !asset.url.endsWith(".pdf") ? (
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <FileText className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="truncate text-xs font-medium">{asset.name}</p>
                  <p className="mt-0.5 truncate font-mono text-[0.6875rem] text-muted-foreground">
                    {asset.width && asset.height
                      ? `${asset.width}×${asset.height}`
                      : asset.type}
                  </p>

                  <div className="mt-3 flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        void copy(asset.url);
                        setCopiedUrl(asset.url);
                      }}
                    >
                      {copied && copiedUrl === asset.url ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      Copy URL
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove from list"
                      onClick={() => setAssets((c) => c.filter((a) => a.url !== asset.url))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

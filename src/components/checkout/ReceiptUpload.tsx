"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface ReceiptUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ReceiptUpload({
  onUploadComplete,
  onUploadError,
}: ReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileName(file.name);
    setUploadedUrl(null);

    handleUpload(file);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/receipt", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed. Please try again.");
      }

      setUploadedUrl(json.url);
      onUploadComplete(json.url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
      onUploadError(message);
      setPreview(null);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    setFileName(null);
    setUploadedUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onUploadError(""); // clear error in parent
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        id="receipt-upload"
        aria-label="Upload payment receipt"
        onChange={handleFileChange}
      />

      {!preview ? (
        <label
          htmlFor="receipt-upload"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-stone-300 bg-stone-50 p-8 text-center transition-colors hover:border-stone-400 hover:bg-stone-100"
        >
          <p className="text-sm font-medium text-stone-700">
            Upload payment receipt
          </p>
          <p className="text-xs text-stone-400">
            JPG, PNG or WebP — max {MAX_SIZE_MB}MB
          </p>
          <span className="mt-1 inline-flex h-8 items-center rounded border border-stone-300 bg-white px-3 text-xs font-medium text-stone-700">
            Choose file
          </span>
        </label>
      ) : (
        <div className="flex flex-col gap-2 rounded border border-stone-200 p-3">
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded bg-stone-100">
              <Image
                src={preview}
                alt="Receipt preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove receipt"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-white shadow-sm border border-stone-200 text-stone-600 hover:bg-stone-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="truncate text-xs text-stone-500">{fileName}</p>
            {uploading && (
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
                Uploading…
              </span>
            )}
            {uploadedUrl && !uploading && (
              <span className="text-xs font-medium text-green-600">
                Uploaded
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      {preview && !uploadedUrl && !uploading && (
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            if (inputRef.current?.files?.[0]) {
              handleUpload(inputRef.current.files[0]);
            }
          }}
        >
          Retry upload
        </Button>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="text-lg font-semibold text-stone-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-stone-500">
        We ran into an unexpected problem. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <a href="/">
          <Button variant="outline">Go home</Button>
        </a>
      </div>
    </div>
  );
}

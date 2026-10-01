import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-stone-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded border border-stone-300 bg-white px-3 py-2 text-base sm:text-sm text-stone-900 placeholder:text-stone-400 resize-none",
            "focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500",
            "disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-500",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
              ? `${textareaId}-hint`
              : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-stone-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-xs text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

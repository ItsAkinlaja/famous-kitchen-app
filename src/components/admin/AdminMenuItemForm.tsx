"use client";

import { useState } from "react";
import { MenuItem } from "@/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface AdminMenuItemFormProps {
  item: MenuItem | null;
  onClose: () => void;
  onSaved: (item: MenuItem, isNew: boolean) => void;
}

export function AdminMenuItemForm({ item, onClose, onSaved }: AdminMenuItemFormProps) {
  const isNew = item === null;

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [sortOrder, setSortOrder] = useState(item?.sort_order?.toString() ?? "0");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) errors.price = "Enter a valid price.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      let finalImageUrl = imageUrl;

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload/menu-image", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.error || "Image upload failed.");
        }
        finalImageUrl = uploadJson.url;
        setUploadingImage(false);
      }

      const supabase = createClient();
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        image_url: finalImageUrl || null,
        is_available: isAvailable,
        sort_order: parseInt(sortOrder) || 0,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data, error: insertError } = await supabase
          .from("menu_items")
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single();

        if (insertError || !data) throw new Error(insertError?.message || "Failed to add item.");
        onSaved(data as MenuItem, true);
      } else {
        const { data, error: updateError } = await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", item!.id)
          .select()
          .single();

        if (updateError || !data) throw new Error(updateError?.message || "Failed to update item.");
        onSaved(data as MenuItem, false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Add menu item" : `Edit ${item?.name}`}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white sm:max-w-md sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <p className="font-semibold text-stone-900">
            {isNew ? "Add menu item" : "Edit item"}
          </p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-stone-400 hover:bg-stone-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={fieldErrors.name}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional short description"
          />
          <Input
            label="Price (₦)"
            type="number"
            min="0"
            step="50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            error={fieldErrors.price}
          />
          <Input
            label="Sort order"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            hint="Lower number appears first"
          />

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">Food image</label>
            {(imagePreview || imageUrl) && (
              <div className="relative h-32 w-full overflow-hidden rounded border border-stone-200 bg-stone-100">
                <Image
                  src={imagePreview ?? imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <label
              htmlFor="menu-image-upload"
              className="inline-flex cursor-pointer items-center rounded border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 w-fit"
            >
              {uploadingImage ? "Uploading…" : "Choose image"}
            </label>
            <input
              id="menu-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
            />
            <p className="text-xs text-stone-400">Or enter URL manually:</p>
            <Input
              placeholder="https://ik.imagekit.io/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setIsAvailable((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 ${
                isAvailable ? "bg-stone-900" : "bg-stone-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isAvailable ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-stone-700">
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              loading={saving}
              className="flex-1"
            >
              {isNew ? "Add item" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

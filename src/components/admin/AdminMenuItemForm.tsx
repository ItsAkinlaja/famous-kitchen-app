"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "@/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { X, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { getMenuItemImage } from "@/lib/menuImages";

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

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Derive the displayed preview: new upload > manual url > fallback > nothing
  const displayImage = imagePreview
    || imageUrl
    || (item ? getMenuItemImage(item) : null);

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Add menu item" : `Edit ${item?.name}`}
    >
      <div className="w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl sm:max-w-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 shrink-0">
          <div>
            <p className="font-semibold text-stone-900">
              {isNew ? "Add menu item" : `Edit — ${item?.name}`}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {isNew ? "Fill in the details below to add a new item." : "Update the item details below."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} id="menu-item-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-0">

              {/* Left — Image panel */}
              <div className="sm:border-r border-stone-100 bg-stone-50 p-5 flex flex-col gap-4">

                {/* Image preview */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-200 border border-stone-200">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={name || "Food image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-stone-400">
                      <ImageIcon className="h-8 w-8" />
                      <p className="text-xs">No image yet</p>
                    </div>
                  )}

                  {/* Image source badge */}
                  {displayImage && !imagePreview && !imageUrl && item && (
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      Default image
                    </div>
                  )}
                  {(imagePreview || imageUrl) && (
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      {imagePreview ? "New upload" : "Custom URL"}
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <label
                  htmlFor="menu-image-upload"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-600 hover:border-[#FC0003] hover:text-[#FC0003] transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Uploading…" : imagePreview ? "Change image" : "Upload image"}
                </label>
                <input
                  id="menu-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                />

                {/* URL input */}
                <div>
                  <p className="text-xs text-stone-400 mb-1.5">Or paste an image URL:</p>
                  <Input
                    placeholder="https://ik.imagekit.io/..."
                    value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(null); setImageFile(null); }}
                  />
                </div>

                {/* Availability toggle */}
                <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-900">Available</p>
                    <p className="text-xs text-stone-400">Show this item on the menu</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAvailable}
                    onClick={() => setIsAvailable((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FC0003] focus:ring-offset-2 ${
                      isAvailable ? "bg-[#FC0003]" : "bg-stone-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isAvailable ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Right — Details */}
              <div className="p-5 flex flex-col gap-4">
                <Input
                  label="Item name"
                  placeholder="e.g. Spaghetti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  error={fieldErrors.name}
                />

                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Short description of the meal (optional)"
                />

                <div className="grid grid-cols-2 gap-3">
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
                    hint="Lower = first"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <p role="alert" className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer — sticky action bar */}
        <div className="border-t border-stone-200 px-5 py-4 flex gap-3 shrink-0 bg-white">
          <Button
            type="submit"
            form="menu-item-form"
            loading={saving}
            className="flex-1 h-11"
          >
            {isNew ? "Add item" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 px-6"
          >
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Menu | Famous Kitchen",
  description:
    "Browse the Famous Kitchen menu. Spaghetti, noodles, yam, plantain, bread, tea, coffee, salad, chicken, beef and more.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function MenuPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const items: MenuItem[] = error ? [] : (data ?? []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Menu</h1>
        <p className="mt-1 text-sm text-stone-500">
          Choose your meal and place your order in a few simple steps.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load menu items. Please refresh the page.
        </div>
      )}

      <MenuGrid items={items} />
    </div>
  );
}

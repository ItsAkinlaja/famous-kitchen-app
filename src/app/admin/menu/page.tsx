import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminMenuManager } from "@/components/admin/AdminMenuManager";
import { MenuItem } from "@/types";

export const revalidate = 0;

export default async function AdminMenuPage() {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const items: MenuItem[] = error ? [] : (data ?? []);

  return (
    <AdminShell>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Menu</h1>
            <p className="mt-0.5 text-sm text-stone-500">
              Manage menu items, prices, and availability.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load menu items. Please refresh.
          </div>
        )}

        <div className="mt-6">
          <AdminMenuManager initialItems={items} />
        </div>
      </div>
    </AdminShell>
  );
}

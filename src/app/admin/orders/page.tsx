import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { OrderWithItems } from "@/types";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*)`)
    .order("created_at", { ascending: false });

  const orders: OrderWithItems[] = error ? [] : (data ?? []);

  return (
    <AdminShell>
      <div className="p-6">
        <h1 className="text-xl font-bold text-stone-900">Orders</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Manage and update customer orders.
        </p>

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load orders. Please refresh.
          </div>
        )}

        <div className="mt-6">
          <AdminOrdersTable orders={orders} />
        </div>
      </div>
    </AdminShell>
  );
}

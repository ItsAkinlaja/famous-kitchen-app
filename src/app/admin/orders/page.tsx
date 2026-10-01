import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { OrderWithItems } from "@/types";

export const revalidate = 0;

interface Props {
  searchParams: Promise<{ status?: string; payment?: string; period?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const supabase = await createServiceClient();
  const params = await searchParams;

  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*)`)
    .order("created_at", { ascending: false });

  let orders: OrderWithItems[] = error ? [] : (data ?? []);

  // Apply filter from overview card query params
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (params.status) {
    orders = orders.filter((o) => o.order_status === params.status);
  } else if (params.payment) {
    orders = orders.filter((o) => o.payment_status === params.payment);
  } else if (params.period === "today") {
    orders = orders.filter((o) => new Date(o.created_at) >= today);
  }

  // Build a human-readable filter label
  const filterLabel =
    params.status ? `Showing: ${params.status} orders`
    : params.payment === "pending" ? "Showing: awaiting payment verification"
    : params.period === "today" ? "Showing: today's orders"
    : null;

  return (
    <AdminShell>
      <div className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Orders</h1>
            <p className="mt-0.5 text-sm text-stone-500">
              Manage and update customer orders.
            </p>
          </div>
          {filterLabel && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FC0003]/10 px-3 py-1 text-xs font-semibold text-[#FC0003] capitalize">
                {filterLabel}
              </span>
              <a
                href="/admin/orders"
                className="text-xs text-stone-400 hover:text-stone-700 underline"
              >
                Clear filter
              </a>
            </div>
          )}
        </div>

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

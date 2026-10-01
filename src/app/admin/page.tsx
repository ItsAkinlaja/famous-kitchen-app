import { createServiceClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/settings";
import Link from "next/link";

async function getOverviewStats() {
  const supabase = await createServiceClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const { data: orders } = await supabase
    .from("orders")
    .select("order_status, payment_status, total, created_at");

  if (!orders) return null;

  const todayOrders = orders.filter((o) => o.created_at >= todayIso);
  const todayRevenue = todayOrders
    .filter((o) => o.payment_status === "verified")
    .reduce((sum, o) => sum + o.total, 0);

  return {
    total: orders.length,
    new: orders.filter((o) => o.order_status === "pending").length,
    awaitingPayment: orders.filter((o) => o.payment_status === "pending").length,
    confirmed: orders.filter((o) => o.order_status === "confirmed").length,
    preparing: orders.filter((o) => o.order_status === "preparing").length,
    completed: orders.filter((o) => o.order_status === "completed").length,
    todayCount: todayOrders.length,
    todayRevenue,
  };
}

export default async function AdminOverviewPage() {
  const stats = await getOverviewStats();

  const statCards = [
    {
      label: "New orders",
      value: stats?.new ?? 0,
      href: "/admin/orders?status=pending",
    },
    {
      label: "Awaiting payment verification",
      value: stats?.awaitingPayment ?? 0,
      href: "/admin/orders?payment=pending",
      highlight: true,
    },
    {
      label: "Confirmed",
      value: stats?.confirmed ?? 0,
      href: "/admin/orders?status=confirmed",
    },
    {
      label: "Preparing",
      value: stats?.preparing ?? 0,
      href: "/admin/orders?status=preparing",
    },
    {
      label: "Completed (all time)",
      value: stats?.completed ?? 0,
      href: "/admin/orders?status=completed",
    },
    {
      label: "Orders today",
      value: stats?.todayCount ?? 0,
      href: "/admin/orders?period=today",
    },
    {
      label: "Revenue today (verified)",
      value: formatCurrency(stats?.todayRevenue ?? 0),
      href: "/admin/orders?period=today",
      wide: true,
    },
  ];

  return (
    <AdminShell>
      <div className="p-6">
        <h1 className="text-xl font-bold text-stone-900">Overview</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          A summary of your current orders and activity.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {statCards.map(({ label, value, highlight, wide, href }) => (
            <Link
              key={label}
              href={href}
              className={`group rounded border p-4 transition-shadow hover:shadow-md cursor-pointer ${
                highlight
                  ? "border-amber-200 bg-amber-50 hover:border-amber-300"
                  : "border-stone-200 bg-white hover:border-stone-300"
              } ${wide ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <p className="text-xs text-stone-500">{label}</p>
              <p className={`mt-1 text-2xl font-bold ${highlight ? "text-amber-700" : "text-stone-900"}`}>
                {value}
              </p>
              <p className="mt-2 text-xs text-stone-400 group-hover:text-[#FC0003] transition-colors">
                View orders →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

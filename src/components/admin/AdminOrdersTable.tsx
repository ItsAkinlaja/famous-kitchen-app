"use client";

import { useState } from "react";
import { OrderWithItems, OrderStatus, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { PaymentStatusBadge, OrderStatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { AdminOrderModal } from "./AdminOrderModal";

interface AdminOrdersTableProps {
  orders: OrderWithItems[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);

  function handleUpdate(orderId: string, updates: Partial<OrderWithItems>) {
    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  }

  if (localOrders.length === 0) {
    return (
      <div className="py-16 text-center rounded border border-stone-200 bg-white">
        <p className="font-medium text-stone-700">No orders yet</p>
        <p className="mt-1 text-sm text-stone-400">
          Orders will appear here once customers place them.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Customer
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 md:table-cell">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Total
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
                  Payment
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {localOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{order.order_number}</p>
                    <p className="text-xs text-stone-400">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{order.customer_name}</p>
                    {order.state_code && (
                      <p className="text-xs font-semibold text-[#FC0003]">{order.state_code}</p>
                    )}
                    <a
                      href={`tel:${order.phone}`}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      {order.phone}
                    </a>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <p className="text-stone-600">
                      {order.order_items.map((i) => `${i.item_name} ×${i.quantity}`).join(", ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <PaymentStatusBadge status={order.payment_status} />
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <OrderStatusBadge status={order.order_status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <AdminOrderModal
          order={localOrders.find((o) => o.id === selectedOrder.id) ?? selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}

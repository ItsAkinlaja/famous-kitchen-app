import { Badge } from "./Badge";
import { OrderStatus, PaymentStatus } from "@/types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === "verified")
    return <Badge variant="success">Payment verified</Badge>;
  if (status === "rejected")
    return <Badge variant="danger">Payment rejected</Badge>;
  return <Badge variant="warning">Awaiting verification</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "default" }> = {
    pending: { label: "Pending", variant: "warning" },
    confirmed: { label: "Confirmed", variant: "info" },
    preparing: { label: "Preparing", variant: "info" },
    ready: { label: "Ready", variant: "success" },
    out_for_delivery: { label: "Out for delivery", variant: "info" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "neutral" };
  return <Badge variant={variant}>{label}</Badge>;
}

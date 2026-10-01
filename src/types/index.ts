// ─── Database Types ───────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "verified" | "rejected";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type OrderType = "pickup" | "delivery";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  state_code: string | null;
  order_type: OrderType;
  delivery_location: string | null;
  delivery_note: string | null;
  subtotal: number;
  takeaway_fee: number;
  delivery_fee: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  receipt_url: string | null;
  payment_rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// ─── Checkout Types ───────────────────────────────────────────────────────────

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  orderType: OrderType;
  deliveryLocation: string;
  deliveryLocationOther: string;
  orderNote: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  email: string;
  stateCode: string;
  orderType: OrderType;
  deliveryLocation: string | null;
  orderNote?: string;
  items: { menuItemId: string; quantity: number }[];
  receiptUrl: string;
}

export interface CreateOrderResponse {
  orderNumber: string;
  orderId: string;
}

// ─── Settings Keys ────────────────────────────────────────────────────────────

export const SETTING_KEYS = {
  BUSINESS_NAME: "business_name",
  PHONE_1: "phone_1",
  PHONE_2: "phone_2",
  WHATSAPP: "whatsapp",
  EMAIL: "email",
  OPENING_HOURS: "opening_hours",
  OPAY_ACCOUNT_NAME: "opay_account_name",
  OPAY_ACCOUNT_NUMBER: "opay_account_number",
  PAYMENT_PROVIDER: "payment_provider",
  TAKEAWAY_FEE: "takeaway_fee",
  DELIVERY_FEE: "delivery_fee",
  DELIVERY_ENABLED: "delivery_enabled",
  CAMP_DELIVERY_FEE: "camp_delivery_fee",
  CAMP_DELIVERY_ENABLED: "camp_delivery_enabled",
  LOCATION_INSTRUCTIONS: "location_instructions",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export interface AppSettings {
  businessName: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  opayAccountName: string;
  opayAccountNumber: string;
  paymentProvider: string;
  takeawayFee: number;
  deliveryFee: number;
  deliveryEnabled: boolean;
  campDeliveryFee: number;
  campDeliveryEnabled: boolean;
  locationInstructions: string;
}

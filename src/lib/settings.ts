import { AppSettings, Setting, SETTING_KEYS } from "@/types";

const DEFAULTS: AppSettings = {
  businessName: "Famous Kitchen",
  phone1: "08164969794",
  phone2: "09127380726",
  whatsapp: "08164969794",
  email: "ayoadeokiki94@gmail.com",
  openingHours: "7:00 AM – 10:00 PM",
  opayAccountName: "AYOADE OKIKI",
  opayAccountNumber: "8109840858",
  paymentProvider: "OPay",
  takeawayFee: 200,
  deliveryFee: 0,
  deliveryEnabled: true,
  campDeliveryFee: 0,
  campDeliveryEnabled: true,
  locationInstructions:
    "We deliver around NYSC camp. Select your preferred pickup or delivery location.",
};

export function parseSettings(rows: Setting[]): AppSettings {
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });

  return {
    businessName: map[SETTING_KEYS.BUSINESS_NAME] ?? DEFAULTS.businessName,
    phone1: map[SETTING_KEYS.PHONE_1] ?? DEFAULTS.phone1,
    phone2: map[SETTING_KEYS.PHONE_2] ?? DEFAULTS.phone2,
    whatsapp: map[SETTING_KEYS.WHATSAPP] ?? DEFAULTS.whatsapp,
    email: map[SETTING_KEYS.EMAIL] ?? DEFAULTS.email,
    openingHours: map[SETTING_KEYS.OPENING_HOURS] ?? DEFAULTS.openingHours,
    opayAccountName:
      map[SETTING_KEYS.OPAY_ACCOUNT_NAME] ?? DEFAULTS.opayAccountName,
    opayAccountNumber:
      map[SETTING_KEYS.OPAY_ACCOUNT_NUMBER] ?? DEFAULTS.opayAccountNumber,
    paymentProvider:
      map[SETTING_KEYS.PAYMENT_PROVIDER] ?? DEFAULTS.paymentProvider,
    takeawayFee: map[SETTING_KEYS.TAKEAWAY_FEE]
      ? Number(map[SETTING_KEYS.TAKEAWAY_FEE])
      : DEFAULTS.takeawayFee,
    deliveryFee: map[SETTING_KEYS.DELIVERY_FEE]
      ? Number(map[SETTING_KEYS.DELIVERY_FEE])
      : DEFAULTS.deliveryFee,
    deliveryEnabled:
      map[SETTING_KEYS.DELIVERY_ENABLED] !== undefined
        ? map[SETTING_KEYS.DELIVERY_ENABLED] === "true"
        : DEFAULTS.deliveryEnabled,
    campDeliveryFee: map[SETTING_KEYS.CAMP_DELIVERY_FEE]
      ? Number(map[SETTING_KEYS.CAMP_DELIVERY_FEE])
      : DEFAULTS.campDeliveryFee,
    campDeliveryEnabled:
      map[SETTING_KEYS.CAMP_DELIVERY_ENABLED] !== undefined
        ? map[SETTING_KEYS.CAMP_DELIVERY_ENABLED] === "true"
        : DEFAULTS.campDeliveryEnabled,
    locationInstructions:
      map[SETTING_KEYS.LOCATION_INSTRUCTIONS] ??
      DEFAULTS.locationInstructions,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");
}

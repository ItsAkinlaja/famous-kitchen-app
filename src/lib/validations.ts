import { OrderType } from "@/types";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  stateCode: string;
  orderType: OrderType;
  deliveryLocation: string;
  deliveryLocationOther: string;
  orderNote: string;
}

export interface CheckoutFormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  stateCode?: string;
  deliveryLocation?: string;
  deliveryLocationOther?: string;
}

export function validateCheckoutForm(
  data: CheckoutFormData
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!/^(\+234|0)[789][01]\d{8}$/.test(data.phone)) {
    errors.phone = "Enter a valid Nigerian phone number (e.g. 08012345678).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.stateCode.trim() || data.stateCode.trim().length < 2) {
    errors.stateCode = "Please enter your NYSC state code (e.g. IM/24A/1234).";
  }

  if (data.orderType === "delivery") {
    if (!data.deliveryLocation.trim()) {
      errors.deliveryLocation = "Please select a delivery location.";
    }
    if (
      data.deliveryLocation === "Other" &&
      !data.deliveryLocationOther.trim()
    ) {
      errors.deliveryLocationOther = "Please describe your delivery location.";
    }
  }

  return errors;
}

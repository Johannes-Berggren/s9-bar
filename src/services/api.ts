import axiosInstance from "@/config/axios";
import type * as Stripe from "stripe";

export async function createCustomerCheckoutSession(memberID: number, customerID: string): Promise<Stripe.Stripe.Checkout.Session> {
  const checkoutSession = await axiosInstance
    .get<Stripe.Stripe.Checkout.Session>(`/createCustomerCheckoutSession/${memberID}/${customerID}`);
  return checkoutSession.data;
}

export async function createCustomerPortalSession(customerID: string): Promise<Stripe.Stripe.BillingPortal.Session> {
  const portalSession = await axiosInstance
    .get<Stripe.Stripe.BillingPortal.Session>(`/createCustomerPortalSession/${customerID}`);
  return portalSession.data;
}

export async function setLock(state: "closed" | "open"): Promise<void> {
  const binaryState = state === "open" ? 1 : 0;
  const res = await axiosInstance
    .get(`http://192.168.50.119:8081/LOCK/${binaryState}`);
  return res.data;
}

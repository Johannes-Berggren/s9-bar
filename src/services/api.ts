import api from "@/config/axios";
import type * as Stripe from "stripe";

export async function createCustomerCheckoutSession(memberID: number, customerID: string): Promise<Stripe.Stripe.Checkout.Session> {
  const checkoutSession = await api.get<Stripe.Stripe.Checkout.Session>(`/createCustomerCheckoutSession/${memberID}/${customerID}`);
  return checkoutSession.data;
}

export async function createCustomerPortalSession(customerID: string): Promise<Stripe.Stripe.BillingPortal.Session> {
  const portalSession = await api.get<Stripe.Stripe.BillingPortal.Session>(`/createCustomerPortalSession/${customerID}`);
  return portalSession.data;
}

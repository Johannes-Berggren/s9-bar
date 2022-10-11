import axiosInstance from "@/config/axios";
import type * as Stripe from "stripe";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";

export async function createCustomerCheckoutSession(memberID: number, customerID: string, priceID: string): Promise<Stripe.Stripe.Checkout.Session> {
  const checkoutSession = await axiosInstance
    .get<Stripe.Stripe.Checkout.Session>(`/createCustomerCheckoutSession/${memberID}/${customerID}/${priceID}`);
  return checkoutSession.data;
}

export async function createCustomerPortalSession(customerID: string): Promise<Stripe.Stripe.BillingPortal.Session> {
  const portalSession = await axiosInstance
    .get<Stripe.Stripe.BillingPortal.Session>(`/createCustomerPortalSession/${customerID}`);
  return portalSession.data;
}

export async function createItem(item: Item): Promise<Item> {
  const itemRes = await axiosInstance.post<Item>("/item", item);
  return itemRes.data;
}

// export async function getItem(id: string): Promise<Item> {
//   const itemRes = await axiosInstance.get<Item>(`/item/${id}`);
//   return itemRes.data;
// }

export async function getItems(): Promise<Item[]> {
  const itemsRes = await axiosInstance.get<Item[]>("/items");
  return itemsRes.data;
}

interface ItemMember {
  item: Item,
  member: Member
}

export async function purchaseItem(itemID: number, count: number, memberID: number): Promise<ItemMember> {
  const itemMemberRes = await axiosInstance.post<ItemMember>(
    `/purchase/${itemID}/${count}/${memberID}`,
  );
  return itemMemberRes.data;
}

export async function updateItem(item: Item): Promise<Item> {
  const itemRes = await axiosInstance.put<Item>("/item", item);
  return itemRes.data;
}

// export async function setLock(state: "closed" | "open"): Promise<void> {
//   const binaryState = state === "open" ? 1 : 0;
//   const res = await axiosInstance
//     .get(`http://192.168.50.119:8081/LOCK/${binaryState}`);
//   return res.data;
// }

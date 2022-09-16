import Item from "../interfaces/Item";
import Member from "../interfaces/Member";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

const app = initializeApp();
const db = getFirestore(app);

export async function getItem(id: number): Promise<Item> {
  const itemSnapshot = await db.collection("items").doc(String(id)).get();
  return itemSnapshot.data() as Item;
}

export async function getItems(): Promise<Item[]> {
  const itemsSnapshot = await db.collection("items").orderBy("name", "asc").get();
  return itemsSnapshot.docs.map((s) => s.data() as Item);
}

export async function getMember(id: number): Promise<Member> {
  const memberSnapshot = await db.collection("members").doc(String(id)).get();
  return memberSnapshot.data() as Member;
}

interface ItemMember {
  item: Item,
  member: Member
}

export async function purchaseItem(itemID: number, count: number, memberID: number): Promise<ItemMember> {
  const [item, member] = await Promise.all([
    getItem(itemID),
    getMember(memberID),
  ]);

  item.currentInventory -= count;
  member.credit -= item.price * count;

  const [updatedItem, updatedMember] = await Promise.all([
    updateItem(item),
    updateMember(member),
  ]);

  return {
    item: updatedItem,
    member: updatedMember,
  };
}

export async function updateItem(item: Item): Promise<Item> {
  const updateObject: Item = {
    ID: item.ID,
    currentInventory: +item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await db.collection("items").doc(String(item.ID)).update(updateObject);
  return getItem(item.ID);
}

export async function updateMember(member: Member): Promise<Member> {
  await db.collection("members").doc(String(member.ID)).update(member);
  return getMember(member.ID);
}


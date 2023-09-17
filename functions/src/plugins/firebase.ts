import Item from "../interfaces/Item";
import Member from "../interfaces/Member";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import Month from "../interfaces/Month";

const app = initializeApp();
const db = getFirestore(app);

async function getNextID(collectionName: string): Promise<number> {
  const collectionSnapshot = await db.collection(collectionName).orderBy("ID", "asc").get();
  const item = collectionSnapshot.docs[collectionSnapshot.docs.length - 1].data() as Item;
  return item.ID + 1;
}

export async function getItem(id: number): Promise<Item> {
  const itemSnapshot = await db.collection("items").doc(String(id)).get();
  return itemSnapshot.data() as Item;
}

export async function getItems(): Promise<Item[]> {
  const itemsSnapshot = await db.collection("items")
    .orderBy("type", "asc")
    .orderBy("name", "asc")
    .get();
  return itemsSnapshot.docs.map((s) => s.data() as Item);
}

export async function getMember(id: number): Promise<Member> {
  const memberSnapshot = await db.collection("members").doc(String(id)).get();
  return memberSnapshot.data() as Member;
}

export async function getMembers(): Promise<Member[]> {
  const memberSnapshots = await db.collection("members")
    .orderBy("firstName", "asc")
    .get();
  return memberSnapshots.docs.map((s) => s.data() as Member);
}

interface ItemMember {
  item: Item,
  member: Member
}

export async function addItem(item: Item): Promise<Item> {
  const ID = await getNextID("items");

  const itemObject: Item = {
    ID,
    archived: false,
    brandName: item.brandName,
    currentInventory: item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    externalPrice: +item.externalPrice,
    type: item.type,
  };
  await db.collection("items").doc(String(itemObject.ID)).set(itemObject);
  return getItem(ID);
}

export async function purchaseItem(itemID: number, count: number, memberID: number): Promise<ItemMember> {
  const [item, member] = await Promise.all([
    getItem(itemID),
    getMember(memberID),
  ]);

  const purchaseSum = item.price * count;
  item.currentInventory -= count;
  member.credit -= purchaseSum;

  const [updatedItem, updatedMember] = await Promise.all([
    updateItem(item),
    updateMember(member),
    countSale(purchaseSum),
  ]);

  return {
    item: updatedItem,
    member: updatedMember,
  };
}

export async function updateItem(item: Item): Promise<Item> {
  const updateObject: Item = {
    ID: item.ID,
    archived: item.archived,
    brandName: item.brandName,
    currentInventory: +item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    externalPrice: +item.externalPrice,
    type: item.type,
  };
  await db.collection("items").doc(String(item.ID)).update(updateObject);
  return getItem(item.ID);
}

export async function updateMember(member: Member): Promise<Member> {
  await db.collection("members").doc(String(member.ID)).update(member);
  return getMember(member.ID);
}

export function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getMonth()}-${now.getFullYear()}`;
}

export async function getMonth(): Promise<Month> {
  const month = getCurrentMonthString();
  const thisMonthSnapshot = await db.collection("sales").doc(month).get();
  if (!thisMonthSnapshot.exists) {
    return {
      ID: month,
      sum: 0,
    };
  }
  return thisMonthSnapshot.data() as Month;
}

export async function getSales(): Promise<Month[]> {
  const salesSnapshots = await db.collection("sales").orderBy("ID", "desc").get();
  return salesSnapshots.docs.map((s) => s.data() as Month);
}

export async function countSale(amount: number) {
  const thisMonth = await getMonth();

  const newSum = thisMonth.sum + amount;

  await db.collection("sales").doc(thisMonth.ID).set({
    ID: thisMonth.ID,
    sum: newSum,
  });
}


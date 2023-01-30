import { db, getNextID } from "../config/firebase";
import Item from "../interfaces/Item";
import ItemMember from "../interfaces/ItemMember";
import { getMember, updateMember } from "./member-service";

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

export async function addItem(item: Item): Promise<Item> {
  const ID = await getNextID("items");

  const itemObject: Item = {
    ID,
    brandName: item.brandName,
    currentInventory: item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await db.collection("items").doc(String(itemObject.ID)).set(itemObject);
  return getItem(ID);
}

export async function updateItem(item: Item): Promise<Item> {
  const updateObject: Item = {
    ID: item.ID,
    brandName: item.brandName,
    currentInventory: +item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await db.collection("items").doc(String(item.ID)).update(updateObject);
  return getItem(item.ID);
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
    // TODO: ADD TRANSACTION
  ]);

  return {
    item: updatedItem,
    member: updatedMember,
  };
}

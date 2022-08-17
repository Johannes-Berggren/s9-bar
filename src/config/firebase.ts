import type Transaction from "@/interfaces/Transaction";
import { initializeApp } from "firebase/app";
import { collection, doc, setDoc, getDocs, getFirestore, query } from "firebase/firestore";
import type Item from "@/interfaces/Item";
import type Member from "@/interfaces/Member";

const firebaseConfig = {
  apiKey: "AIzaSyDcRk89s5vl4ihZ1J_cO0e6AOMDMIkXIz0",
  authDomain: "s9bar-54d46.firebaseapp.com",
  projectId: "s9bar-54d46",
  storageBucket: "s9bar-54d46.appspot.com",
  messagingSenderId: "815180929686",
  appId: "1:815180929686:web:ac9bdb834bf375220540b7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getID(collectionName: string): Promise<number> {
  const itemsQuery = query(collection(db, collectionName));
  const itemsSnapshot = await getDocs(itemsQuery);
  const sortedDocs = itemsSnapshot.docs.sort((a, b) => a.data().ID - b.data().ID);
  return parseInt(sortedDocs[sortedDocs.length - 1].data().ID);
}

export async function addItem(item: Item): Promise<void> {
  const oldID = await getID("items");
  const ID = oldID + 1;

  const itemObject: Item = {
    ID,
    currentInventory: item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await setDoc(doc(db, "items", `${itemObject.ID}`), itemObject);
}

export async function getItems(): Promise<Item[]> {
  const itemsQuery = query(collection(db, "items"));
  const itemsSnapshot = await getDocs(itemsQuery);
  return itemsSnapshot.docs.map((s) => s.data() as Item);
}

export async function updateItem(item: Item): Promise<void> {
  const updateObject: Item = {
    ID: item.ID,
    currentInventory: +item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await setDoc(doc(db, "items", `${updateObject.ID}`), updateObject);
}

export async function updateMember(member: Member): Promise<void> {
  const updateObject: Member = {
    ID: member.ID,
    admin: member.admin,
    code: member.code,
    credit: member.credit,
    email: member.email,
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone,
    stripeID: member.stripeID,
  };
  await setDoc(doc(db, "members", `${updateObject.ID}`), updateObject);
}

export async function getMembers(): Promise<Member[]> {
  const membersQuery = query(collection(db, "members"));
  const membersSnapshot = await getDocs(membersQuery);
  return membersSnapshot.docs.map((s) => s.data() as Member);
}

export async function getTransactions(): Promise<Transaction[]> {
  const transactionsQuery = query(collection(db, "transactions"));
  const transactionsSnapshot = await getDocs(transactionsQuery);
  return transactionsSnapshot.docs.map((s) => s.data() as Transaction);
}

export {
  app,
  db,
};

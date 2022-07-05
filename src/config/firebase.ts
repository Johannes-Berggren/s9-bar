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

export async function addItem(item: Item): Promise<void> {
  // TODO: Find next index
  const itemObject: Item = {
    ID: item.ID,
    currentInventory: +item.currentInventory,
    imageURL: item.imageURL,
    name: item.name,
    price: +item.price,
    type: item.type,
  };
  await setDoc(doc(db, "items", String(item.ID)), itemObject);
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
  await setDoc(doc(db, "items", String(item.ID)), updateObject);
}

// export async function addMember(member: Member): Promise<Member> {
//   // TODO
// }

// export async function editMember(member: Member): Promise<Member> {
//   // TODO
// }

export async function getMembers(): Promise<Member[]> {
  const membersQuery = query(collection(db, "members"));
  const membersSnapshot = await getDocs(membersQuery);

  return membersSnapshot.docs.map((s) => s.data() as Member);
}

export {
  app,
  db,
};

import Item from "../interfaces/Item";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

const app = initializeApp();
const db = getFirestore(app);

async function getNextID(collectionName: string): Promise<number> {
  const collectionSnapshot = await db.collection(collectionName).orderBy("ID", "asc").get();
  const item = collectionSnapshot.docs[collectionSnapshot.docs.length - 1].data() as Item;
  return item.ID + 1;
}

export {
  db,
  getNextID,
};

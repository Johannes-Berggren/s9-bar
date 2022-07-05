import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

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

async function addItem() {
  // TODO
}

async function getItems() {
  const itemsQuery = query(collection(db, "items"));
  const itemsSnapshot = await getDocs(itemsQuery);

  return itemsSnapshot.docs.map((s) => s.data());
}

async function addMember() {
  // TODO
}

async function editMember() {
  // TODO
}

async function getMembers() {
  const membersQuery = query(collection(db, "members"));
  const membersSnapshot = await getDocs(membersQuery);

  return membersSnapshot.docs.map((s) => s.data());
}

export {
  addItem,
  addMember,
  app,
  db,
  editMember,
  getItems,
  getMembers,
};

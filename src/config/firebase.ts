import type Member from "@/interfaces/Member";
import type Transaction from "@/interfaces/Transaction";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

export async function getMembers(): Promise<Member[]> {
  const membersQuery = query(collection(db, "members"));
  const membersSnapshot = await getDocs(membersQuery);
  return membersSnapshot.docs
    .map((s) => s.data() as Member)
    .sort((a, b) => a.firstName.localeCompare(b.firstName));
}

export async function getTransactions(): Promise<Transaction[]> {
  const transactionsQuery = query(collection(db, "transactions"));
  const transactionsSnapshot = await getDocs(transactionsQuery);
  return transactionsSnapshot.docs.map((s) => s.data() as Transaction);
}

export {
  db,
};

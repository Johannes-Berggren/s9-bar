import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import Member from "../interfaces/Member";

const app = initializeApp();
const db = getFirestore(app);

export async function getMember(id: number): Promise<Member> {
  const memberSnapshot = await db.collection("members").doc(String(id)).get();
  return memberSnapshot.data() as Member;
}

// export async function getMemberByStripeID(stripeID: string): Promise<Member> {
//   const memberSnapshots = await db.collection("members").where("stripeID", "==", stripeID).get();
//   return memberSnapshots.docs[0].data() as Member;
// }

export async function updateMember(member: Member): Promise<Member> {
  await db.collection("members").doc(String(member.ID)).update(member);
  return getMember(member.ID);
}


import { db } from "../config/firebase";
import Member from "../interfaces/Member";

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

export async function updateMember(member: Member): Promise<Member> {
  await db.collection("members").doc(String(member.ID)).update(member);
  return getMember(member.ID);
}

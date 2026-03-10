import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function GET() {
  const colRef = collection(db, "test");

  const docRef = await addDoc(colRef, {
    message: "Firebase Firestore connected successfully",
    createdAt: new Date().toISOString(),
  });

  return Response.json({ success: true, id: docRef.id });
}
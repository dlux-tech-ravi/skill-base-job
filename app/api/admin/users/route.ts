import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  const users = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));

  return NextResponse.json({ users });
}


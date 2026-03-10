import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recruiterId = (session.user as any).id ?? (session.user as any).email;

  const applicationsRef = collection(db, "applications");
  const snap = await getDocs(
    query(
      applicationsRef,
      where("recruiterId", "==", recruiterId),
      orderBy("createdAt", "desc")
    )
  );

  const applications = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));

  return NextResponse.json({ applications });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, status } = await req.json();

  if (!applicationId || !status) {
    return NextResponse.json(
      { error: "applicationId and status are required" },
      { status: 400 }
    );
  }

  const recruiterId = (session.user as any).id ?? (session.user as any).email;

  const ref = doc(db, "applications", applicationId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  const data = snap.data() as any;

  if (data.recruiterId !== recruiterId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await updateDoc(ref, { status });

  return NextResponse.json({ success: true });
}


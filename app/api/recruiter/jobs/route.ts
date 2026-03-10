import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recruiterId = (session.user as any).id ?? (session.user as any).email;

  const jobsRef = collection(db, "jobs");
  const snap = await getDocs(
    query(jobsRef, where("recruiterId", "==", recruiterId))
  );

  const jobs = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }));

  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, company, location, type, salaryRange, description, skills } =
    body;

  if (!title || !company) {
    return NextResponse.json(
      { error: "Title and company are required" },
      { status: 400 }
    );
  }

  const recruiterId = (session.user as any).id ?? (session.user as any).email;
  const recruiterName = (session.user as any).name;
  const recruiterEmail = (session.user as any).email;

  const jobsRef = collection(db, "jobs");

  const docRef = await addDoc(jobsRef, {
    title,
    company,
    location: location || "",
    type: type || "",
    salaryRange: salaryRange || "",
    description: description || "",
    skills: Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [],
    recruiterId,
    recruiterName,
    recruiterEmail,
    status: "open",
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ id: docRef.id });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId, status } = await req.json();

  if (!jobId || !status) {
    return NextResponse.json(
      { error: "jobId and status are required" },
      { status: 400 }
    );
  }

  const recruiterId = (session.user as any).id ?? (session.user as any).email;

  const ref = doc(db, "jobs", jobId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const data = snap.data() as any;

  if (data.recruiterId !== recruiterId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await updateDoc(ref, { status });

  return NextResponse.json({ success: true });
}


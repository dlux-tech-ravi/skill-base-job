import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "jobseeker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json(
      { error: "jobId is required" },
      { status: 400 }
    );
  }

  const jobRef = doc(db, "jobs", jobId);
  const jobSnap = await getDoc(jobRef);

  if (!jobSnap.exists()) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const job = jobSnap.data() as any;

  const candidateId = (session.user as any).id ?? (session.user as any).email;

  const applicationsRef = collection(db, "applications");

  await addDoc(applicationsRef, {
    jobId,
    jobTitle: job.title,
    recruiterId: job.recruiterId,
    recruiterName: job.recruiterName,
    candidateId,
    candidateName: (session.user as any).name,
    candidateEmail: (session.user as any).email,
    status: "applied",
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}


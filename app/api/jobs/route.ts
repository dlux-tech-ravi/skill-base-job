import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query as fsQuery,
  orderBy,
} from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const jobsRef = collection(db, "jobs");
    const snap = await getDocs(fsQuery(jobsRef, orderBy("createdAt", "desc")));

    const recruiterJobs = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
      source: "recruiter",
      url: `/jobs/${doc.id}`,
    }));

    const externalJobs: any[] = [];
    try {
      const remotiveUrl = search
        ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(
            search
          )}`
        : "https://remotive.com/api/remote-jobs";

      const res = await fetch(remotiveUrl);
      const json = await res.json();

      if (Array.isArray(json.jobs)) {
        externalJobs.push(
          ...json.jobs.slice(0, 20).map((j: any) => ({
            ...j,
            source: "external",
          }))
        );
      }
    } catch (e) {
      console.error("Failed to fetch external jobs", e);
    }

    const all = [...recruiterJobs, ...externalJobs];

    const filtered =
      search.trim().length === 0
        ? all
        : all.filter((job) =>
            `${job.title ?? ""} ${job.company_name ?? job.company ?? ""}`
              .toLowerCase()
              .includes(search.toLowerCase())
          );

    return NextResponse.json({ jobs: filtered });
  } catch (error) {
    console.error("JOBS API ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}


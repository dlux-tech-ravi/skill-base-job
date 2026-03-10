"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/RecruiterSidebar";
import RecruiterHeader from "@/components/RecruiterHeader";

export default function RecruiterJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role !== "recruiter") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const loadJobs = async () => {
    try {
      const res = await fetch("/api/recruiter/jobs");
      if (!res.ok) return;
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const updateStatus = async (jobId: string, status: string) => {
    try {
      const res = await fetch("/api/recruiter/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status }),
      });
      if (res.ok) {
        await loadJobs();
      }
    } catch {
      // ignore for now
    }
  };

  return (
    <div className="flex">
      <RecruiterSidebar />

      <div className="ml-64 w-full bg-gray-100 min-h-screen">
        <RecruiterHeader />

        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">
            Your Jobs
          </h1>

          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-3"
                    >
                      No jobs posted yet.
                    </td>
                  </tr>
                )}
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td className="capitalize">{job.status}</td>
                    <td>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={job.status}
                        onChange={(e) =>
                          updateStatus(job.id, e.target.value)
                        }
                      >
                        <option value="open">Open</option>
                        <option value="paused">Paused</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


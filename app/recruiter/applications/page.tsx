"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/RecruiterSidebar";
import RecruiterHeader from "@/components/RecruiterHeader";

export default function RecruiterApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);

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

  const loadApplications = async () => {
    try {
      const res = await fetch("/api/recruiter/applications");
      if (!res.ok) return;
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      setApplications([]);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      const res = await fetch("/api/recruiter/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });
      if (res.ok) {
        await loadApplications();
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
            Applications
          </h1>

          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Job</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-3"
                    >
                      No applications yet.
                    </td>
                  </tr>
                )}
                {applications.map((app) => (
                  <tr key={app.id} className="border-t">
                    <td>{app.candidateName}</td>
                    <td>{app.candidateEmail}</td>
                    <td>{app.jobTitle}</td>
                    <td className="capitalize">{app.status}</td>
                    <td>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value)
                        }
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
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


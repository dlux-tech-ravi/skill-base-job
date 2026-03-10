"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/RecruiterSidebar";
import RecruiterHeader from "@/components/RecruiterHeader";
import RecruiterStats from "@/components/RecruiterStats";

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

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

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await fetch("/api/recruiter/applications");
        if (!res.ok) return;
        const data = await res.json();
        setRecentApplications((data.applications || []).slice(0, 5));
      } catch {
        setRecentApplications([]);
      }
    };

    loadApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <RecruiterSidebar />

      <div className="ml-64 w-full flex flex-col">
        <RecruiterHeader />

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-slate-200">
                Track your jobs and candidate pipeline at a glance.
              </p>
            </div>
          </div>

          <RecruiterStats />

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-xl font-semibold mb-4">
              Recent Applications
            </h2>

            <div className="overflow-hidden rounded-xl border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-900">
                  <tr className="text-left text-slate-100">
                    <th className="px-3 py-2 font-medium">Candidate</th>
                    <th className="px-3 py-2 font-medium">Job Title</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-slate-200 py-4 text-xs"
                      >
                        No applications yet.
                      </td>
                    </tr>
                  )}
                  {recentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t border-slate-800 hover:bg-slate-900"
                    >
                      <td className="px-3 py-2 text-slate-50">
                        {app.candidateName}
                      </td>
                      <td className="px-3 py-2 text-slate-50">
                        {app.jobTitle}
                      </td>
                      <td className="px-3 py-2 capitalize text-xs text-blue-300">
                        {app.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
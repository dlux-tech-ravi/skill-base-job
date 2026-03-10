"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobseekers, setJobseekers] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) return;
        const data = await res.json();
        const users = data.users || [];
        setJobseekers(users.filter((u: any) => u.role === "jobseeker"));
        setRecruiters(users.filter((u: any) => u.role === "recruiter"));
      } catch {
        setJobseekers([]);
        setRecruiters([]);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Control Center
            </h1>
            <p className="mt-1 text-sm text-slate-100">
              Full overview of users across the platform.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-slate-800 border border-slate-700 px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-semibold">
              A
            </div>
              <div className="text-xs">
                <p className="font-medium text-white">Admin</p>
                <p className="text-white">System owner</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-xs font-medium px-4 py-2 rounded-full border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 p-[1px] shadow-lg shadow-blue-900/40">
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-xs text-slate-100">Total users</p>
              <p className="mt-2 text-2xl font-semibold">
                {jobseekers.length + recruiters.length}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-900/40">
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-xs text-slate-100">Jobseekers</p>
              <p className="mt-2 text-2xl font-semibold">
                {jobseekers.length}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-[1px] shadow-lg shadow-pink-900/40">
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-xs text-slate-100">Recruiters</p>
              <p className="mt-2 text-2xl font-semibold">
                {recruiters.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Jobseekers</h2>
              <span className="text-[10px] uppercase tracking-wide text-slate-200">
                {jobseekers.length} users
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr className="text-left text-white">
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {jobseekers.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-slate-200 py-4 text-xs"
                      >
                        No jobseekers yet.
                      </td>
                    </tr>
                  )}
                  {jobseekers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-slate-800/70 hover:bg-slate-900/80"
                    >
                      <td className="px-3 py-2 text-slate-50">{u.name}</td>
                      <td className="px-3 py-2 text-slate-50">
                        {u.email}
                      </td>
                      <td className="px-3 py-2 capitalize text-xs text-slate-100">
                        {u.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recruiters</h2>
              <span className="text-[10px] uppercase tracking-wide text-slate-200">
                {recruiters.length} users
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr className="text-left text-white">
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-slate-200 py-4 text-xs"
                      >
                        No recruiters yet.
                      </td>
                    </tr>
                  )}
                  {recruiters.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-slate-800/70 hover:bg-slate-900/80"
                    >
                      <td className="px-3 py-2 text-slate-50">{u.name}</td>
                      <td className="px-3 py-2 text-slate-50">
                        {u.email}
                      </td>
                      <td className="px-3 py-2 capitalize text-xs text-slate-100">
                        {u.role}
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
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function RecruiterHeader() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");

  const name = (session?.user as any)?.name ?? "Recruiter";

  return (
    <div className="flex justify-between items-center bg-slate-900 px-8 py-4 shadow-md border-b border-slate-800">
      <input
        placeholder="Search candidates by name, skill or job..."
        className="border border-slate-700 bg-slate-800 text-slate-100 px-4 py-2 rounded-lg w-80 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <button
          className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-lg hover:bg-slate-700 border border-slate-700"
          aria-label="Notifications"
        >
          🔔
        </button>

        <div className="flex items-center gap-3 rounded-full bg-slate-800 border border-slate-700 px-4 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-semibold uppercase">
            {name.charAt(0)}
          </div>
          <div className="text-xs text-slate-100">
            <p className="font-medium">{name}</p>
            <p className="text-slate-400">Recruiter</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs font-medium px-4 py-2 rounded-full border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
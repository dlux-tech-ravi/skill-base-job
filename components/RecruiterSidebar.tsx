"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/recruiter/dashboard", label: "Dashboard" },
  { href: "/recruiter/post-job", label: "Post Job" },
  { href: "/recruiter/jobs", label: "Manage Jobs" },
  { href: "/recruiter/applications", label: "Applications" },
  { href: "/recruiter/candidates", label: "Candidates" },
  { href: "/recruiter/analytics", label: "Analytics" },
];

export default function RecruiterSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-slate-950 text-white fixed border-r border-slate-800">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          SkillJob
        </span>
      </div>

      <nav className="p-4 space-y-1 text-sm">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg ${
                active
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-200 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
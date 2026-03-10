"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RecruiterSidebar from "@/components/RecruiterSidebar";
import RecruiterHeader from "@/components/RecruiterHeader";

export default function PostJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salaryRange: "",
    skills: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role !== "recruiter") {
      router.push("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/recruiter/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Failed to post job");
      } else {
        alert("Job posted successfully");
        router.push("/recruiter/jobs");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <RecruiterSidebar />

      <div className="ml-64 w-full bg-gray-100 min-h-screen">
        <RecruiterHeader />

        <div className="p-8 max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">
            Post a New Job
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <input
                className="border rounded w-full p-2"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company *
                </label>
                <input
                  className="border rounded w-full p-2"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  className="border rounded w-full p-2"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Type
                </label>
                <input
                  placeholder="Full-time, Remote, Contract..."
                  className="border rounded w-full p-2"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary Range
                </label>
                <input
                  placeholder="₹10L - ₹18L"
                  className="border rounded w-full p-2"
                  value={form.salaryRange}
                  onChange={(e) =>
                    setForm({ ...form, salaryRange: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skills (comma separated)
              </label>
              <input
                placeholder="React, TypeScript, Node.js"
                className="border rounded w-full p-2"
                value={form.skills}
                onChange={(e) =>
                  setForm({ ...form, skills: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="border rounded w-full p-2 h-32"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


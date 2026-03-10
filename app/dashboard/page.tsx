"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ResumeUploader from "@/components/ResumeUploader";
import ProfileCard from "@/components/ProfileCard";
import SkillsCard from "@/components/SkillsCard";
import ExperienceCard from "@/components/ExperienceCard";
import ResumeScoreChart from "@/components/ResumeScoreChart";
import TotalExperienceCard from "@/components/TotalExperienceCard";
import Navbar from "@/components/Navbar";
import JobList from "@/components/JobList";

function AISidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<
    { from: "user" | "assistant"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-job-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "assistant",
          text: data.answer ?? "Unable to generate a response.",
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          from: "assistant",
          text: "Something went wrong talking to the AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed bottom-20 right-4 z-50 w-80 h-96 bg-white rounded-xl shadow-lg border flex flex-col">
      <div className="px-4 py-2 border-b flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">AI Career Assistant</h2>
          <p className="text-[11px] text-gray-500">
            Ask about careers, interview prep, or search for roles.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          aria-label="Close chat"
        >
          <span className="text-lg leading-none">&times;</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-xs">
            Start a conversation by asking “What skills do I need for a React
            developer role?” or “Show React jobs in Bangalore”.
          </p>
        )}
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`text-sm ${
              m.from === "user" ? "text-right text-blue-700" : "text-left"
            }`}
          >
            <span
              className={
                m.from === "user"
                  ? "inline-block bg-blue-50 px-2 py-1 rounded-lg"
                  : "inline-block bg-gray-100 px-2 py-1 rounded-lg"
              }
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-3 py-2 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask anything about jobs…"
          className="border rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as any)?.role;
    if (role && role !== "jobseeker") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchInitialJobs = async () => {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    };
    fetchInitialJobs();
  }, []);

  const searchJobs = async (query: string) => {
    const res = await fetch(`/api/jobs?search=${encodeURIComponent(query)}`);
    const result = await res.json();
    setJobs(result.jobs || []);
  };

  const fetchMatchedJobs = async () => {
    if (!data?.skills) return;
    const skill = data.skills[0]?.name || "developer";
    await searchJobs(skill);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="bg-gray-100 min-h-screen p-8 max-w-7xl mx-auto px-6 py-4">
        <div>
          <div>
            <div className="grid md:grid-cols-4 gap-6 mb-8" />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <ResumeUploader
                  setData={setData}
                  setPreview={setPreview}
                  onSearchJobs={searchJobs}
                  data={data}
                />
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="font-semibold mb-4">Resume Preview</h2>

                {preview ? (
                  <iframe
                    src={preview}
                    className="w-full h-[400px] border rounded-lg"
                    title="Resume Preview"
                  />
                ) : (
                  <p className="text-gray-400">No resume uploaded</p>
                )}
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
                {data?.skills?.length > 0 && (
                  <button
                    onClick={fetchMatchedJobs}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Refresh based on resume
                  </button>
                )}
              </div>

              <JobList jobs={jobs} />
            </div>

            <div>
              {data && (
                <div className="grid md:grid-cols-2 gap-6 mt-10">
                  <ProfileCard data={data} />
                  <ExperienceCard exp={data.workExperience} />
                  <TotalExperienceCard exp={data.workExperience} />
                  <ResumeScoreChart data={data} />
                  <SkillsCard skills={data.skills} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isAiOpen && (
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open AI assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}

      {isAiOpen && <AISidebar onClose={() => setIsAiOpen(false)} />}
    </>
  );
}

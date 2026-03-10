"use client";

import { useEffect, useState } from "react";
import HomeHeader from "@/components/HomeHeader";
import JobCards from "@/components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();

        const recruiterJobs = (data.jobs || []).filter(
          (j: any) => j.source === "recruiter"
        );

        const mapped = recruiterJobs.map((j: any) => ({
          title: j.title,
          description: j.description || "",
          skills_required: Array.isArray(j.skills) ? j.skills : [],
        }));

        setJobs(mapped);
      } catch {
        setJobs([]);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Find Your <span className="text-blue-600">Dream Job</span>
            {"  "}
            With AI Skill Matching
          </h1>

          <p className="text-gray-600 mt-6 text-lg">
            Upload your resume and let our AI analyze your skills, experience,
            and recommend the best job opportunities for you.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="border px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Login
            </a>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://img.freepik.com/free-psd/medium-shot-woman-working-call-center_23-2150454165.jpg?t=st=1772997206~exp=1773000806~hmac=c5ae84b01ed0f2d79b6af907cc8533ca581579ed0ab63c07affd2cc605c721ec&w=1480"
            alt="Job search"
            className="w-[450px]"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">
          Latest Jobs from Recruiters
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Fresh openings posted directly by recruiters on this platform.
        </p>
        <JobCards jobs={jobs} />
      </section>
    </div>
  );
}
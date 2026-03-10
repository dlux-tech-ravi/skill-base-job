"use client";

import { useEffect, useState } from "react";

type MatchedJobsClientProps = {
  skill: string;
};

export default function MatchedJobsClient({ skill }: MatchedJobsClientProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skill) {
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const remotiveRes = await fetch(
          `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(
            skill
          )}`
        );

        const remotiveData = await remotiveRes.json();

        const remotiveJobs = remotiveData.jobs.map((job: any) => ({
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location,
          url: job.url,
        }));

        const adzunaRes = await fetch(
          `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=YOUR_ID&app_key=YOUR_KEY&what=${encodeURIComponent(
            skill
          )}`
        );

        const adzunaData = await adzunaRes.json();

        const adzunaJobs = adzunaData.results.map((job: any) => ({
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          url: job.redirect_url,
        }));

        const mergedJobs = [...remotiveJobs, ...adzunaJobs].slice(0, 12);

        setJobs(mergedJobs);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchJobs();
  }, [skill]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">
        Matched Jobs for "{skill || "Unknown Skill"}"
      </h1>

      {loading && <p className="text-gray-500">Loading jobs...</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map((job, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">{job.title}</h3>

            <p className="text-gray-600 mt-1">{job.company}</p>

            <p className="text-gray-400 text-sm mt-1">{job.location}</p>

            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-orange-500 mt-4 inline-block font-medium"
            >
              View Job →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}


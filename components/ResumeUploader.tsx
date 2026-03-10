"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUploader({
  setData,
  onSearchJobs,
  setPreview,
  data
}: any) {
  
 const router = useRouter();

  const goToMatchedJobs = () => {

    if (!data?.skills) return;

    const skill = data.skills[0]?.name || "developer";

    router.push(`/matched-jobs?skill=${skill}`);
  };

  const [query, setQuery] = useState("");

  const uploadResume = async (e: any) => {

    const file = e.target.files[0];
// create preview url
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/resume-upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setData(data);
  };

  return (

    <div>

      <h2 className="text-xl font-semibold mb-4">
        Upload Your Resume
      </h2>

      <p className="text-gray-500 mb-4">
        Upload your resume to analyze skills and find matching jobs.
      </p>

      {/* Upload */}
      <input
        type="file"
        onChange={uploadResume}
        className="w-full border rounded-lg p-3"
      />

      {/* MATCH JOB BUTTON */}
      <button
         onClick={goToMatchedJobs}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      >
        Get Matched Jobs
      </button>
<div className="py-4 items-center justify-center">
  <p>or</p>
</div>
      {/* SEARCH JOBS */}
      <div className="mt-4 flex gap-2">

        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Search jobs (React Developer...)"
          className="border p-3 rounded-lg flex-1"
        />

        <button
          onClick={()=>onSearchJobs(query)}
          className="bg-orange-500 text-white px-4 rounded-lg"
        >
          Search
        </button>

      </div>

    </div>
  );
}
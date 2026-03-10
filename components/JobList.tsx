export default function JobList({ jobs }: any) {
  if (!jobs || jobs.length === 0) {
    return (
      <p className="text-gray-400">
        No jobs found. Try searching.
      </p>
    );
  }

  const applyToJob = async (job: any) => {
    if (job.source !== "recruiter" || !job.id) {
      if (job.url) {
        window.open(job.url, "_blank");
      }
      return;
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (!res.ok) {
        alert("Failed to apply for this job.");
        return;
      }

      alert("Applied successfully!");
    } catch (e) {
      alert("Something went wrong while applying.");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {jobs.map((job: any, i: number) => {
        const isRecruiterJob = job.source === "recruiter";
        const company = job.company_name || job.company || "Company";

        return (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg">
                {job.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {company}
              </p>

              {job.category && (
                <p className="text-gray-400 text-xs mt-1">
                  {job.category}
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              {isRecruiterJob ? (
                <button
                  onClick={() => applyToJob(job)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Apply
                </button>
              ) : (
                <a
                  href={job.url}
                  target="_blank"
                  className="text-orange-500 text-sm inline-block"
                >
                  View Job →
                </a>
              )}

              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                {isRecruiterJob ? "Recruiter" : "External"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
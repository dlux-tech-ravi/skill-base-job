export default function JobCards({ jobs }: any) {
  if (!jobs) return null;

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">
      {jobs.map((job: any, i: number) => (
        <div
          key={i}
          className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-xl transition"
        >
          <h3 className="text-xl font-bold mb-2">
            {job.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {job.skills_required.map((skill: string, i: number) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-600 px-3 py-1 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
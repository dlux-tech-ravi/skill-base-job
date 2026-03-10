export default function ExperienceCard({ exp }: any) {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Work Experience
      </h2>

      <div className="space-y-4">

        {exp?.map((job: any, i: number) => (

          <div key={i} className="border-b pb-3">

            <p className="font-semibold">
              {job.jobTitle}
            </p>

            <p className="text-gray-600">
              {job.organization}
            </p>

            {/* SHOW DATE TEXT */}
            <p className="text-sm text-orange-500">
              {job?.dates?.rawText}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}
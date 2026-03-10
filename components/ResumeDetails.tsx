export default function ResumeDetails({ data }: any) {
  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">

      <h2 className="text-2xl font-bold mb-4">
        Resume Details
      </h2>

      <p><b>Name:</b> {data.name}</p>
      <p><b>Email:</b> {data.email}</p>
      <p><b>Phone:</b> {data.phone}</p>

      <div className="mt-4">
        <b>Skills:</b>

        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills.map((skill: string, i: number) => (
            <span
              key={i}
              className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <b>Experience:</b>
        <p>{data.experience}</p>
      </div>
    </div>
  );
}
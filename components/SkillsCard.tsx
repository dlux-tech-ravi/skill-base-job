export default function SkillsCard({ skills }: any) {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">

        {skills?.map((skill: any, i: number) => (

          <span
            key={i}
            className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
          >
            {skill.name}
          </span>

        ))}

      </div>

    </div>

  );
}
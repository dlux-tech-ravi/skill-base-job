"use client";

import { PieChart, Pie, Tooltip } from "recharts";

export default function SkillsChart({ skills }: any) {

  const data =
    skills?.map((skill: any) => ({
      name: skill.name,
      value: 1
    })) || [];

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Skills Distribution
      </h2>

      <PieChart width={300} height={250}>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          fill="#FF3901"
          label
        />

        <Tooltip />

      </PieChart>

    </div>

  );
}
"use client";

import { PieChart, Pie } from "recharts";

export default function ResumeScoreChart({ data }: any) {

  const checks = [
    data?.name,
    data?.emails?.length,
    data?.phoneNumbers?.length,
    data?.skills?.length,
    data?.workExperience?.length
  ];

  const score =
    (checks.filter(Boolean).length / checks.length) * 100;

  const chartData = [
    { name: "Completed", value: score },
    { name: "Missing", value: 100 - score }
  ];

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Resume Completeness
      </h2>

      <PieChart width={300} height={250}>

        <Pie
          data={chartData}
          dataKey="value"
          outerRadius={90}
          fill="#F07800"
          label
        />

      </PieChart>

      <p className="text-center text-xl font-bold mt-3">
        {score.toFixed(0)}%
      </p>

    </div>

  );
}
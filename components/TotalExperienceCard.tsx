"use client";

export default function TotalExperienceCard({ exp }: any) {

  function calculateExperience() {

    let totalMonths = 0;

    exp?.forEach((job: any) => {

      const dateText = job?.dates?.rawText;

      if (!dateText) return;

      const parts = dateText.split("-");

      const startText = parts[0].trim();
      const endText = parts[1].trim();

      const startDate = new Date(startText);

      const endDate =
        endText.toLowerCase() === "present"
          ? new Date()
          : new Date(endText);

      const months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      totalMonths += months;

    });

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    return `${years}y ${remainingMonths}m`;
  }

  const totalExperience = calculateExperience();

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Total Experience
      </h2>

      <p className="text-4xl font-bold text-orange-500">
        {totalExperience}
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Calculated from resume dates
      </p>

    </div>

  );
}
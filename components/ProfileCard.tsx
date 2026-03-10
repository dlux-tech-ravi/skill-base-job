"use client";

export default function ProfileSummary({ data }: any) {

  if (!data) return null;

  return (

    <div className="bg-white p-8 rounded-2xl shadow-lg border">

      <h2 className="text-xl font-semibold mb-4">
        Candidate Overview
      </h2>

      <p className="text-gray-700">
        <b>Name:</b> {data?.name?.first} {data?.name?.last}
      </p>

      <p className="text-gray-700 mt-2">
        <b>Email:</b> {data?.emails?.[0]}
      </p>

      <p className="text-gray-700 mt-2">
        <b>Skills:</b> {data?.skills?.length}
      </p>

      <p className="text-gray-700 mt-2">
        <b>Experience:</b> {data?.workExperience?.length} roles
      </p>

    </div>

  );
}
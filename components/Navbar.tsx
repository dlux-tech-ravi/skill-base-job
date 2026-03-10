"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Puducherry",
  "Jammu and Kashmir",
  "Ladakh",
];

export default function Navbar() {
  const { data: session } = useSession();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const filteredStates = useMemo(() => {
    if (!location.trim()) return INDIAN_STATES;
    return INDIAN_STATES.filter((s) =>
      s.toLowerCase().includes(location.toLowerCase())
    );
  }, [location]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="text-xl font-bold text-blue-600 cursor-pointer">
          SkillJob
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 w-full max-w-md">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search jobs, roles, skills..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Select location"
              className="border rounded-lg px-3 py-2 w-48 text-sm"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (!locationOpen) setLocationOpen(true);
              }}
              onFocus={() => {
                setLocationOpen(true);
              }}
              onBlur={() => {
                // small delay so click on option still registers
                setTimeout(() => setLocationOpen(false), 100);
              }}
            />
            {locationOpen && filteredStates.length > 0 && (
              <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded-lg shadow z-20">
                {filteredStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => {
                      setLocation(state);
                      setLocationOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-700 border rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
              👤
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res: any = await signIn("credentials", {
      redirect: false,
      email: user,
      password,
    });

    if (res?.error) {
      setError("Invalid admin username or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-xl w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Admin username"
          className="border p-2 w-full mb-3 rounded"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white w-full p-2 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-3 text-sm">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          Use the admin credentials configured for this portal.
        </p>
      </form>
    </div>
  );
}


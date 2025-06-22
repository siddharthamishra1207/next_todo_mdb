"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await axios.post("/api/auth/signup", { email, username, password });
      router.push("/login");
    } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "Signup failed");
      return;
    }

    if (err instanceof Error) {
      setError(err.message);
      return;
    }

    setError("Signup failed");
  }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Signup</h1>
      <input
        className="border p-2 mb-2"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleSignup}>
        Signup
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-2">
        Already have an account? <a className="text-blue-600" href="/login">Login</a>
      </p>
    </div>
  );
}
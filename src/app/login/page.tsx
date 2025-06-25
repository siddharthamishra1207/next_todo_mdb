"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      document.cookie = `token=${res.data.token}; path=/`;
      router.push("/view");
    } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "login failed");
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
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
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
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleLogin}>
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-2">
        Don&apos;t have an account? <a className="text-blue-600" href="/signup">Signup</a>
      </p>
    </div>
  );
}
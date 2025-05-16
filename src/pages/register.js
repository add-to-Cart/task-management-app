import { useState } from "react";
import { useRouter } from "next/router";
import Alert from "./components/Alert";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // 🛡️ Confirm password check
    if (password !== confirmPassword) {
      setType("error");
      setMessage("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setType("success");
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setType("error");
      setMessage(data.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 p-10 rounded-xl shadow-lg bg-white border border-gray-200">
      <h1 className="text-center mb-6 font-extrabold text-2xl text-gray-900">
        Create Account
      </h1>

      {message && (
        <Alert message={message} type={type} onClose={() => setMessage("")} />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoComplete="off"
          aria-label="Username"
          className="px-4 py-3 text-base rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors duration-300 placeholder-gray-400"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="off"
          aria-label="Password"
          className="px-4 py-3 text-base rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors duration-300 placeholder-gray-400"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          autoComplete="off"
          aria-label="Confirm Password"
          className="px-4 py-3 text-base rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors duration-300 placeholder-gray-400"
        />

        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white font-semibold text-lg rounded-lg py-3 shadow-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
          aria-label="Register"
        >
          Register
        </button>
      </form>

      <p className="mt-8 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-600 font-semibold hover:underline focus:underline focus:outline-none"
        >
          Log in here
        </a>
      </p>
    </div>
  );
}

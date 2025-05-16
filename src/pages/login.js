import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 New error state
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous error

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      setError(data.message || "Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      <section className="w-full h-36 sm:h-auto sm:w-3/5 flex flex-col justify-center px-4 sm:px-16 py-6 sm:py-32 bg-gray-100 text-[#2c3e50] text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight sm:tracking-wide leading-tight mb-4 sm:mb-6 whitespace-nowrap max-w-full">
          Welcome to TaskMaster
        </h1>
        <p className="max-w-lg text-base sm:text-lg leading-relaxed font-normal hidden sm:block mx-auto sm:mx-0">
          Manage your tasks effortlessly. Stay organized, prioritize
          efficiently, and track your progress with ease.
        </p>
      </section>

      <section className="w-full sm:w-2/5 flex items-center justify-center px-8 py-10 sm:px-12 sm:py-24 bg-white border-l border-gray-300">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-8 sm:mb-10 tracking-wide text-center text-[#34495e] custom-letter-spacing">
            Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 sm:gap-7"
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              autoComplete="off"
              aria-label="Username"
              className="p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="off"
              aria-label="Password"
              className="p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {error && (
              <div className="text-red-600 text-sm font-medium text-center -mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              aria-label="Log In"
              className="mt-4 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold text-lg rounded-md py-3 shadow-md transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-8 sm:mt-10 text-center text-gray-600 text-sm font-normal">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register here
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

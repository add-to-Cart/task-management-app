"use client";

import AuthenticatedLayout from "@/pages/components/AuthenticatedLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "./components/Alert";

export default function CreateTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [token, setToken] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "info" });
  const [priority, setPriority] = useState("normal");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setAlert({ message: "You must be logged in.", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, status, priority, description, dueDate }),
      });

      if (res.ok) {
        setAlert({ message: "Task created successfully!", type: "success" });
        setTimeout(() => router.push("/"), 1500);
      } else {
        setAlert({ message: "Failed to create task", type: "error" });
      }
    } catch (err) {
      setAlert({ message: "Something went wrong", type: "error" });
    }
  };

  return (
    <AuthenticatedLayout>
      <Alert
        message={alert.message}
        type={alert.type}
        duration={4000}
        onClose={() => setAlert({ message: "", type: "info" })}
      />
      <div className="max-w-5xl mx-auto px-6 py-10 bg-gray-50 border border-gray-300 rounded-md mt-5">
        <Link
          href="/"
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-semibold mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8 border-b border-gray-300 pb-2">
          Create New Task
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium mb-2"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-gray-700 font-medium mb-2"
              >
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-gray-700 font-medium mb-2"
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={10}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer transition-colors text-gray-800 font-medium py-3 px-6 rounded-md focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 hover:cursor-pointer transition-colors  text-white font-semibold py-3 px-6 rounded-md focus:outline-none"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}

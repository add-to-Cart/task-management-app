"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/pages/components/AuthenticatedLayout";

export default function ViewTask() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!id || !token) return;

    const fetchTask = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTask(data);
        } else if (res.status === 404) {
          setError("Task not found");
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Failed to fetch task");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, token]);

  const formatStatus = (status) => {
    switch (status) {
      case "todo":
        return "To-Do";
      case "in_progress":
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading task...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!task) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mt-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mb-8 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
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

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">
              {task.title || "Untitled Task"}
            </h1>

            <div className="space-y-4 text-sm text-gray-800">
              <div className="flex items-start gap-4">
                <span className="w-28 font-semibold">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full font-medium text-sm ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress" ||
                        task.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : task.status === "pending"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {formatStatus(task.status)}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <span className="w-28 font-semibold">Priority:</span>
                <span
                  className={`px-3 py-1 rounded-full font-medium text-sm ${
                    {
                      low: "bg-green-400 text-gray-900",
                      normal: "bg-yellow-400 text-gray-900",
                      high: "bg-red-600 text-white",
                    }[(task.priority || "").toLowerCase()] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.priority
                    ? task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1).toLowerCase()
                    : "No priority"}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <span className="w-28 font-semibold">Due Date:</span>
                <span>{formatDate(task.dueDate)}</span>
              </div>

              {task.createdAt && (
                <div className="flex items-start gap-4">
                  <span className="w-28 font-semibold">Created At:</span>
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {task.description?.trim() || "No description provided."}
              </p>
            </div>

            <div className="mt-10 text-right">
              <Link
                href={`/task/${id}/edit`}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md transition"
              >
                Edit Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

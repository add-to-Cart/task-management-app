"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import Category from "./components/Category";
import Alert from "./components/Alert";
import PriorityBadge from "./components/Badge";

export default function Home() {
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const router = useRouter();
  const [alert, setAlert] = useState({ message: "", type: "info" });

  const colors = [
    "#E3F2FD",
    "#FFF3E0",
    "#E8F5E9",
    "#F3E5F5",
    "#FFF9C4",
    "#E0F7FA",
    "#FFEBEE",
    "#E8EAF6",
    "#FCE4EC",
    "#FFF8E1",
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    fetchTasks(token);
  }, [token]);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const colored = data.map((task) => ({
          ...task,
          color: colors[task.id % colors.length],
        }));
        setTasks(colored.sort((a, b) => a.title.localeCompare(b.title)));
      } else if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Failed to fetch tasks", res.status);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCreate = () => router.push("/create");

  const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showAlert("Task deleted successfully", "success");
    } else {
      showAlert("Failed to delete task", "error");
    }
  };

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (res.ok) {
        const updated = await res.json();
        updated.color = tasks.find((t) => t.id === id)?.color;
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setEditingId(null);
        setEditTitle("");
        showAlert("Task updated successfully", "success");
      }
    } catch (err) {
      showAlert("Failed to update task", "error");
    }
  };

  const moveToInProgress = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "in-progress" }),
      });

      if (res.ok) {
        const updated = await res.json();
        updated.color = tasks.find((t) => t.id === id)?.color;
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const viewTaskDetails = (task) => router.push(`/task/${task.id}`);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
  };

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((t) => (!priorityFilter ? true : t.priority === priorityFilter));

  const today = new Date();
  const missedTasks = filteredTasks.filter(
    (t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < today
  );

  const grouped = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  };

  return (
    <AuthenticatedLayout>
      <Alert
        message={alert.message}
        type={alert.type}
        duration={4000}
        onClose={() => setAlert({ message: "", type: "info" })}
      />
      <main className="min-h-screen bg-gray-100 px-6 py-6 text-gray-900 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-gray-300">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full max-w-xs md:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleCreate}
            className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 hover:cursor-pointer text-white px-5 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Create Task
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-3">To Do</h2>
            <div className="bg-white border border-gray-200 rounded p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {grouped.todo.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No tasks found</p>
              ) : (
                grouped.todo.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded border flex justify-between items-center hover:shadow-sm hover:cursor-pointer"
                    style={{ backgroundColor: task.color }}
                    onClick={() => viewTaskDetails(task)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="truncate text-sm font-medium text-gray-800 max-w-[70%]">
                        {task.title}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToInProgress(task.id);
                      }}
                      className="text-xs bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 hover:cursor-pointer"
                    >
                      Start
                    </button>
                  </div>
                ))
              )}
            </div>
            <h2 className="text-lg font-semibold mt-6 mb-3">Missed Tasks</h2>
            <div className="bg-red-50 border border-red-200 rounded p-4 space-y-3 max-h-[40vh] overflow-y-auto">
              {missedTasks.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No overdue tasks</p>
              ) : (
                missedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded border border-red-200 bg-red-100 flex justify-between items-center hover:shadow-sm hover:cursor-pointer"
                    onClick={() => viewTaskDetails(task)}
                  >
                    <span className="truncate text-sm font-medium text-red-900 max-w-[55%]">
                      {task.title}
                    </span>
                    <span className="text-xs text-red-700 italic mr-4">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigating to details
                        handleDelete(task.id);
                      }}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:cursor-pointer"
                      aria-label={`Delete task ${task.title}`}
                      title={`Delete task ${task.title}`}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-9 grid grid-cols-1 gap-6">
            <Category
              status="in-progress"
              title="In Progress"
              tasks={grouped["in-progress"]}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSave={saveEdit}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onViewDetails={viewTaskDetails}
              onCancelEdit={() => setEditingId(null)}
              className="bg-white border border-gray-200 rounded p-4 space-y-3 max-h-[70vh] overflow-y-auto"
            />

            <Category
              status="completed"
              title="Completed"
              tasks={grouped.completed}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSave={saveEdit}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onViewDetails={viewTaskDetails}
              onCancelEdit={() => setEditingId(null)}
              className="bg-white border border-gray-200 rounded p-4 space-y-3 max-h-[70vh] overflow-y-auto"
            />
          </section>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}

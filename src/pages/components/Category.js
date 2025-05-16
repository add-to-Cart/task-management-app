import { useRouter } from "next/router";
import React from "react";

export default function Category({ title, tasks, onDelete }) {
  const router = useRouter();

  const handleViewDetails = (taskId) => {
    router.push(`/task/${taskId}`);
  };

  const handleEditTask = (e, taskId) => {
    e.stopPropagation();
    router.push(`/task/${taskId}/edit`);
  };

  return (
    <div className="flex-1 min-w-[280px] bg-[#F9FAFB] p-5 border border-gray-300 rounded-md max-h-[70vh] overflow-y-auto">
      <h2 className="border-b border-gray-400 pb-2 mb-4 text-gray-800 text-lg font-bold uppercase tracking-wider text-center">
        {title}
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center mt-12">
          No tasks
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const statusClasses = {
              "in-progress": "bg-blue-100 text-gray-900 border-blue-500",
              completed: "bg-green-100 text-gray-800 border-green-500",
              default: "bg-gray-100 text-gray-900 border-gray-300",
            };

            const bgClass = statusClasses[task.status] || statusClasses.default;

            return (
              <li
                key={task.id}
                onClick={() => handleViewDetails(task.id)}
                className={`p-3 border ${bgClass} rounded-sm text-sm font-medium flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer`}
              >
                <span className="truncate max-w-[70%]">{task.title}</span>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex gap-2"
                >
                  {task.status !== "completed" && (
                    <button
                      onClick={(e) => handleEditTask(e, task.id)}
                      className="px-3 py-1 bg-yellow-500 text-white text-xs border border-yellow-600 rounded-sm hover:bg-yellow-600 hover:border-yellow-700 hover:cursor-pointer transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs border border-red-700 rounded-sm hover:bg-red-700 hover:border-red-800 hover:cursor-pointer transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

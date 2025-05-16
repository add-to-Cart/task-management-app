import { useState, useEffect } from "react";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TaskForm({ task, onSave }) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "todo",
  });

  useEffect(() => {
    setForm({
      id: task?.id || null,
      title: task?.title || "",
      description: task?.description || "",
      dueDate: formatDate(task?.dueDate),
      priority: task?.priority || "Medium",
      status: task?.status || "todo",
    });
  }, [task]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const submitData = { ...form };
    if (!submitData.id) delete submitData.id;

    if (onSave) onSave(submitData);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "12px",
          maxWidth: "520px",
          width: "100%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: "600",
            color: "#222",
          }}
        >
          {form.id ? "Edit Task" : "Create Task"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="title"
            style={{ fontWeight: "600", marginBottom: "0.4rem", color: "#444" }}
          >
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1.8px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.25s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="description"
            style={{ fontWeight: "600", marginBottom: "0.4rem", color: "#444" }}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add task details (optional)"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1.8px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.25s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="dueDate"
            style={{ fontWeight: "600", marginBottom: "0.4rem", color: "#444" }}
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1.8px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.25s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="priority"
            style={{ fontWeight: "600", marginBottom: "0.4rem", color: "#444" }}
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1.8px solid #ccc",
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "#fff",
              outline: "none",
              transition: "border-color 0.25s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="status"
            style={{ fontWeight: "600", marginBottom: "0.4rem", color: "#444" }}
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1.8px solid #ccc",
              fontSize: "1rem",
              cursor: "pointer",
              backgroundColor: "#fff",
              outline: "none",
              transition: "border-color 0.25s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.65rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#3b82f6",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          {form.id ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}

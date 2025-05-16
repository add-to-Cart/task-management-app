import { readTasks, writeTasks, addTask } from "@/lib/taskStore";
import { verifyToken } from "@/lib/auth";

export default function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (req.method === "GET") {
    const tasks = readTasks();
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { id, title, description, priority, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    try {
      const tasks = readTasks();

      // Get numeric IDs only
      const numericIds = tasks
        .map((t) => Number(t.id))
        .filter((id) => !isNaN(id));

      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

      const newId = (maxId + 1).toString();

      const newTask = {
        id: newId, // always server-generated ID
        title,
        description,
        priority,
        dueDate,
        status,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      };

      addTask(newTask);

      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ message: "Error saving task", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

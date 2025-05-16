import { readTasks, writeTasks } from "@/lib/taskStore";
import { verifyToken } from "@/lib/auth";

export default function handler(req, res) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.query;
    const tasks = readTasks();

    if (!tasks || !Array.isArray(tasks)) {
      throw new Error("Tasks data is invalid or missing");
    }

    const taskIndex = tasks.findIndex((t) => String(t.id) === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.method === "GET") {
      return res.status(200).json(tasks[taskIndex]);
    } else if (req.method === "PATCH") {
      const { title, status, description, dueDate, priority } = req.body;

      if (title !== undefined) tasks[taskIndex].title = title;
      if (status !== undefined) tasks[taskIndex].status = status;
      if (description !== undefined) tasks[taskIndex].description = description;
      if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
      if (priority !== undefined) tasks[taskIndex].priority = priority;

      writeTasks(tasks);
      return res.status(200).json(tasks[taskIndex]);
    } else if (req.method === "DELETE") {
      tasks.splice(taskIndex, 1);
      writeTasks(tasks);
      return res.status(204).end();
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API handler error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

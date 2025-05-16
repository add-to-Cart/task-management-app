import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

export function readTasks() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData || "[]");
  } catch (error) {
    console.error("Error reading tasks.json:", error);
    return [];
  }
}

export function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function addTask(newTask) {
  const tasks = readTasks();
  tasks.push(newTask);
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function updateTask(updatedTask) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    return true;
  } else {
    return false;
  }
}

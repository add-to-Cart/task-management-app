import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export function readUsers() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData || "[]");
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
}

export function writeUsers(users) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users.json:", error);
  }
}

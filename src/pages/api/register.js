import { readUsers, writeUsers } from "@/lib/userStore";

export default function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { username, password } = req.body;

      const users = readUsers();
      const userExists = users.some((u) => u.username === username);

      if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
      }

      users.push({ username, password });
      writeUsers(users);

      return res.status(201).json({ message: "User registered" });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

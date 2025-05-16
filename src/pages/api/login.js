import { readUsers } from "@/lib/userStore";
import { createToken } from "@/lib/auth";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken({ username });
    return res.status(200).json({ token });
  }

  res.status(405).json({ message: "Method not allowed" });
}

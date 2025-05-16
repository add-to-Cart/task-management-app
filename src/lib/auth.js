import jwt from "jsonwebtoken";

//.env will be deleted, for demo, dummy secret key was included.
const SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET || "QH}P6EKm9sajfqC1R%BM@TTGXk)pavW,";

export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

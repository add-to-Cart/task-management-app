import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export default function Navbar() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleKeyLogout = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLogout();
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-300 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-extrabold tracking-wide text-gray-900 uppercase select-none">
        Task Manager
      </h1>

      {isMobile ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 text-3xl font-bold focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm select-none">
              <p className="font-semibold text-gray-800 mb-4 truncate">
                {username}
              </p>
              <button
                onClick={handleLogout}
                onKeyDown={handleKeyLogout}
                className="w-full text-center px-3 py-2 text-red-700 font-semibold border border-red-700 rounded hover:bg-red-700 hover:text-white hover:cursor-pointer transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <span className="text-gray-700 font-semibold select-none">
            Hello, {username}
          </span>
          <button
            onClick={handleLogout}
            onKeyDown={handleKeyLogout}
            className="px-5 py-2 text-red-700 font-semibold border border-red-700 rounded hover:bg-red-700 hover:text-white hover:cursor-pointer transition focus:outline-none"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

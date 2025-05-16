// components/AuthenticatedLayout.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

export default function AuthenticatedLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return checked ? (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "1.5rem",
          paddingLeft: "3rem",
          paddingRight: "3rem",
        }}
      >
        {children}
      </div>
    </>
  ) : null;
}

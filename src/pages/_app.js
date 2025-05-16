// pages/_app.js
import { useEffect, useState } from "react";
import "@/styles/globals.css";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const requiresAuth = Component.requiresAuth || false;
  let content = <Component {...pageProps} />;

  if (requiresAuth) {
    content = <AuthenticatedLayout>{content}</AuthenticatedLayout>;
  }

  return content;
}

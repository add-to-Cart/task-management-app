// pages/_app.js
import "@/styles/globals.css";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

export default function App({ Component, pageProps }) {
  const requiresAuth = Component.requiresAuth || false;

  let content = <Component {...pageProps} />;

  if (requiresAuth) {
    content = <AuthenticatedLayout>{content}</AuthenticatedLayout>;
  }

  return content;
}

import type { Metadata } from "next";
import Link from "next/link";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "Sorry, the page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <div className={css.wrapper}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link href="/" className={css.link}>
          Go to Home
        </Link>
      </div>
    </main>
  );
}

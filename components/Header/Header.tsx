"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container/Container";
import css from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <Container>
        <div className={css.inner}>
          <div className={css.logo}>
            <svg width="136" height="15">
              <use href="/icons/sprite.svg#logo" />
            </svg>
          </div>

          <nav className={css.nav}>
            <Link
              href="/"
              className={`${css.link} ${pathname === "/" ? css.active : ""}`}
            >
              Home
            </Link>

            <Link
              href="/catalog"
              className={`${css.link} ${
                pathname.startsWith("/catalog") ? css.active : ""
              }`}
            >
              Catalog
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

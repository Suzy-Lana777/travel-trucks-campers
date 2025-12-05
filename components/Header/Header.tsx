"use client";

import Link from "next/link";
import Container from "@/components/Container/Container";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Container>
        <div className={css.inner}>
          <div className={css.logo}>TravelTrucks</div>

          <nav className={css.nav}>
            <Link href="/" className={css.link}>
              Home
            </Link>
            <Link href="/catalog" className={css.link}>
              Catalog
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

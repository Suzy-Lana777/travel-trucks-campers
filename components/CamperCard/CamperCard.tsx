"use client";

import Image from "next/image";
import Link from "next/link";
import type { Camper } from "@/types/camper";
import css from "./CamperCard.module.css";

interface CamperCardProps {
  camper: Camper;
}

export default function CamperCard({ camper }: CamperCardProps) {
  const gallery = camper.gallery ?? camper.галерея ?? [];
  const mainPhoto = gallery[0]?.thumb || "/images/placeholder-camper.jpg";

  return (
    <article className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={mainPhoto}
          alt={camper.name}
          fill
          className={css.image}
          sizes="(max-width: 768px) 100vw, 290px"
        />
      </div>

      <div className={css.content}>
        <header className={css.header}>
          <h2 className={css.title}>{camper.name}</h2>
          <p className={css.price}>€{camper.price.toFixed(2)}</p>
        </header>

        <p className={css.location}>{camper.location}</p>
        <p className={css.description}>{camper.description}</p>

        {/* Тут потім додамо «фічі», кнопки обраного, тощо */}

        <div className={css.footer}>
          <Link href={`/catalog/${camper.id}`} className={css.button}>
            Show more
          </Link>
        </div>
      </div>
    </article>
  );
}

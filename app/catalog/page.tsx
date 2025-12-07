"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Container from "@/components/Container/Container";
import { useCampersStore } from "@/lib/store/campersStore";
import css from "./page.module.css";

export default function CatalogPage() {
  const { campers, page, isLoading, error, hasMore, loadCampers } =
    useCampersStore();

  // локальний стан фільтрів
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState<
    "" | "van" | "fullyIntegrated" | "alcove"
  >("");
  const [equipment, setEquipment] = useState<string[]>([]);

  // перше завантаження
  useEffect(() => {
    loadCampers({ page: 1 }, { append: false });
  }, [loadCampers]);

  const toggleEquipment = (key: string) => {
    setEquipment(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
    );
  };

  const handleSearch = () => {
    // формуємо параметри для бекенду
    const params: any = {
      page: 1,
    };

    if (location.trim()) params.location = location.trim();
    if (vehicleType) params.form = vehicleType;

    if (equipment.includes("AC")) params.AC = true;
    if (equipment.includes("kitchen")) params.kitchen = true;
    if (equipment.includes("automatic")) params.transmission = "automatic";
    if (equipment.includes("bathroom")) params.bathroom = true;
    if (equipment.includes("TV")) params.TV = true;

    loadCampers(params, { append: false });
  };

  const handleLoadMore = () => {
    loadCampers({ page: page + 1 }, { append: true });
  };

  return (
    <main className={css.main}>
      <Container>
        {/* <h1 className={css.title}></h1> */}

        <div className={css.layout}>
          {/* ==== ЛІВА КОЛОНКА – ФІЛЬТРИ ==== */}
          <aside className={css.filters}>
            <div className={css.filterBlock}>
              <p className={css.filterLabel}>Location</p>
              <div className={css.locationInputWrapper}>
                {/* тут можна буде додати іконку, якщо захочеш */}
                <input
                  type="text"
                  placeholder="City, Country"
                  className={css.locationInput}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className={css.filterBlock}>
              <p className={css.filterCaption}>Filters</p>
              <p className={css.filterLabel}>Vehicle equipment</p>

              <div className={css.filtersGrid}>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("AC") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("AC")}
                >
                  AC
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("automatic") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("automatic")}
                >
                  Automatic
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("kitchen") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("kitchen")}
                >
                  Kitchen
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("TV") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("TV")}
                >
                  TV
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("bathroom") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("bathroom")}
                >
                  Bathroom
                </button>
              </div>
            </div>

            <div className={css.filterBlock}>
              <p className={css.filterLabel}>Vehicle type</p>
              <div className={css.filtersGrid}>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    vehicleType === "van" ? css.filterBtnActive : ""
                  }`}
                  onClick={() =>
                    setVehicleType(prev => (prev === "van" ? "" : "van"))
                  }
                >
                  Van
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    vehicleType === "fullyIntegrated" ? css.filterBtnActive : ""
                  }`}
                  onClick={() =>
                    setVehicleType(prev =>
                      prev === "fullyIntegrated" ? "" : "fullyIntegrated",
                    )
                  }
                >
                  Fully Integrated
                </button>
                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    vehicleType === "alcove" ? css.filterBtnActive : ""
                  }`}
                  onClick={() =>
                    setVehicleType(prev => (prev === "alcove" ? "" : "alcove"))
                  }
                >
                  Alcove
                </button>
              </div>
            </div>

            <button
              type="button"
              className={css.searchBtn}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </aside>

          {/* ==== ПРАВА КОЛОНКА – КАРТКИ ==== */}
          <section className={css.listSection}>
            {error && <p className={css.error}>{error}</p>}

            <ul className={css.list}>
              {campers.map(camper => (
                <li key={camper.id} className={css.card}>
                  {/* Фото */}
                  {camper.gallery?.[0]?.thumb && (
                    <div className={css.cardImageWrapper}>
                      <Image
                        src={camper.gallery[0].thumb}
                        alt={camper.name}
                        width={290}
                        height={310}
                        className={css.cardImage}
                      />
                    </div>
                  )}

                  {/* Контент картки */}
                  <div className={css.cardContent}>
                    <div className={css.cardTitleRow}>
                      <h2 className={css.cardTitle}>{camper.name}</h2>
                      <span className={css.cardPrice}>
                        €{camper.price.toFixed(2)}
                      </span>
                    </div>

                    <p className={css.cardMeta}>
                      <span>Rating: {camper.rating}</span>
                      <span className={css.cardDot}>•</span>
                      <span>{camper.location}</span>
                    </p>

                    <p className={css.cardDesc}>{camper.description}</p>

                    <Link
                      href={`/catalog/${camper.id}`}
                      className={css.moreBtn}
                    >
                      Show more
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                type="button"
                className={css.loadMoreBtn}
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load more"}
              </button>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import Container from "@/components/Container/Container";
import { useCampersStore } from "@/lib/store/campersStore";
import css from "./page.module.css";

type VehicleForm = "" | "van" | "fullyIntegrated" | "alcove";

type SearchParams = {
  page: number;
  location?: string;
  form?: VehicleForm;
  AC?: boolean;
  kitchen?: boolean;
  transmission?: string;
  bathroom?: boolean;
  TV?: boolean;
};

export default function CatalogPage() {
  const {
    campers,
    page,
    isLoading,
    error,
    hasMore,
    loadCampers,

    // ✅ favorites from Zustand
    favoriteIds,
    toggleFavorite,
    isFavorite,
  } = useCampersStore();

  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleForm>("");
  const [equipment, setEquipment] = useState<string[]>([]);

  // ✅ зберігаємо останні застосовані фільтри, щоб Load more працював стабільно
  const [appliedParams, setAppliedParams] = useState<
    Omit<SearchParams, "page">
  >({});

  const toggleEquipment = (key: string) => {
    setEquipment(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
    );
  };

  // ✅ toast + Zustand toggle
  const handleToggleFavorite = (id: string) => {
    const wasFav = isFavorite(id);
    toggleFavorite(id);

    if (wasFav) {
      toast("Removed from favourites");
    } else {
      toast.success("Added to favourites");
    }
  };

  useEffect(() => {
    // перший рендер — без фільтрів
    void loadCampers({ page: 1 }, { append: false });
  }, [loadCampers]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const computedSearchParams = useMemo<Omit<SearchParams, "page">>(() => {
    const params: Omit<SearchParams, "page"> = {};

    if (location.trim()) params.location = location.trim();
    if (vehicleType) params.form = vehicleType;

    if (equipment.includes("AC")) params.AC = true;
    if (equipment.includes("kitchen")) params.kitchen = true;
    if (equipment.includes("automatic")) params.transmission = "automatic";
    if (equipment.includes("bathroom")) params.bathroom = true;
    if (equipment.includes("TV")) params.TV = true;

    return params;
  }, [location, vehicleType, equipment]);

  const handleSearch = () => {
    // ✅ застосовуємо фільтри, запам'ятовуємо їх, і грузимо з page=1
    setAppliedParams(computedSearchParams);

    void loadCampers({ page: 1, ...computedSearchParams }, { append: false });
    toast.success("Filters applied");
  };

  const handleLoadMore = () => {
    // ✅ Load more бере саме appliedParams (останні застосовані фільтри)
    void loadCampers({ page: page + 1, ...appliedParams }, { append: true });
  };

  return (
    <main className={css.main}>
      <Container>
        <div className={css.layout}>
          <aside className={css.filters}>
            <div className={css.filterBlock}>
              <p className={css.filterLabel}>Location</p>

              <div className={css.locationInputWrapper}>
                <svg
                  className={css.locationIcon}
                  width={20}
                  height={20}
                  aria-hidden="true"
                >
                  <use href="/icons/sprite.svg#Map" />
                </svg>

                <input
                  type="text"
                  placeholder="City, Country"
                  className={css.locationInput}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className={`${css.filterBlock} ${css.filterBlockEquipment}`}>
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
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#AC" />
                  </svg>
                  <span>AC</span>
                </button>

                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("automatic") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("automatic")}
                >
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Automatic" />
                  </svg>
                  <span>Automatic</span>
                </button>

                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("kitchen") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("kitchen")}
                >
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Kitchen" />
                  </svg>
                  <span>Kitchen</span>
                </button>

                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("TV") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("TV")}
                >
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#TV" />
                  </svg>
                  <span>TV</span>
                </button>

                <button
                  type="button"
                  className={`${css.filterBtn} ${
                    equipment.includes("bathroom") ? css.filterBtnActive : ""
                  }`}
                  onClick={() => toggleEquipment("bathroom")}
                >
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Bathroom" />
                  </svg>
                  <span>Bathroom</span>
                </button>
              </div>
            </div>

            <div className={`${css.filterBlock} ${css.filterBlockVehicleType}`}>
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
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Van" />
                  </svg>
                  <span>Van</span>
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
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Fully" />
                  </svg>
                  <span>Fully Integrated</span>
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
                  <svg
                    className={css.filterIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  >
                    <use href="/icons/sprite.svg#Alcove" />
                  </svg>
                  <span>Alcove</span>
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

          <section className={css.listSection}>
            {error && <p className={css.error}>{error}</p>}

            <ul className={css.list}>
              {campers.map(camper => (
                <li key={camper.id} className={css.card}>
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

                  <div className={css.cardContent}>
                    <div className={css.cardTitleRow}>
                      <h2 className={css.cardTitle}>{camper.name}</h2>

                      <div className={css.cardPriceWrap}>
                        <span className={css.cardPrice}>
                          €{camper.price.toFixed(2)}
                        </span>

                        <button
                          type="button"
                          className={`${css.heartBtn} ${
                            favoriteIds.includes(camper.id)
                              ? css.heartActive
                              : ""
                          }`}
                          aria-label="Add to favourites"
                          onClick={() => handleToggleFavorite(camper.id)}
                        >
                          <svg
                            className={css.heartIcon}
                            width={24}
                            height={24}
                            aria-hidden="true"
                          >
                            <use href="/icons/sprite.svg#Heart" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className={css.cardMeta}>
                      <span className={css.cardRating}>
                        <svg
                          className={css.cardRatingIcon}
                          width={16}
                          height={16}
                          aria-hidden="true"
                        >
                          <use href="/icons/sprite.svg#Star" />
                        </svg>
                        <span>{camper.rating.toFixed(1)}</span>
                      </span>

                      <span className={css.cardDot}>•</span>

                      <span className={css.cardLocation}>
                        {camper.location}
                      </span>
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

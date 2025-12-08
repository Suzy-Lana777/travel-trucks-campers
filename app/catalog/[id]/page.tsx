"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Container from "@/components/Container/Container";
import type { Camper } from "@/types/camper";
import { getCamperById } from "@/lib/api/campersApi";
import css from "./page.module.css";

type TabKey = "features" | "reviews";

interface FeatureBadge {
  key: string;
  label: string;
  iconId?: string;
}

export default function CamperDetailsPage() {
  const params = useParams<{ id: string }>();
  const camperId = params?.id;

  const [camper, setCamper] = useState<Camper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("features");
  const [isBooked, setIsBooked] = useState<boolean>(false);

  useEffect(() => {
    if (!camperId) return;

    const loadCamper = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getCamperById(String(camperId));
        setCamper(data);
      } catch {
        setError("Failed to load camper details.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCamper();
  }, [camperId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBooked(true);
  };

  if (isLoading) {
    return (
      <main className={css.main}>
        <Container>
          <p className={css.centerText}>Loading...</p>
        </Container>
      </main>
    );
  }

  if (error || !camper) {
    return (
      <main className={css.main}>
        <Container>
          <p className={css.centerText}>{error ?? "Camper not found."}</p>
        </Container>
      </main>
    );
  }

  const gallery = camper.gallery ?? camper.галерея ?? [];
  const mainImage = gallery[0]?.original ?? gallery[0]?.thumb ?? "";

  const reviewsCount: number = camper.reviews?.length ?? 0;
  const rating: number = camper.rating ?? 0;

  const formValue: string | undefined = camper.form ?? camper.форма;
  const lengthValue: string | undefined = camper.length ?? camper.длина;
  const widthValue: string | undefined = camper.width ?? camper.ширина;
  const heightValue: string | undefined = camper.height ?? camper.высота;
  const tankValue: string | undefined =
    camper.tank ?? camper.бак ?? camper.back;
  const consumptionValue: string | undefined =
    camper.consumption ?? camper.расход;

  const transmissionValue: string | undefined =
    camper.transmission ?? camper.трансмиссия;
  const engineValue: string | undefined = camper.engine ?? camper.двигатель;

  const hasAC: boolean = Boolean(camper.AC ?? camper.кондиционер);
  const hasKitchen: boolean = Boolean(camper.kitchen ?? camper.кухня);
  const hasBathroom: boolean = Boolean(camper.bathroom ?? camper.ванная);
  const hasTV: boolean = Boolean(camper.TV ?? camper.телевизор);
  const hasRadio: boolean = Boolean(camper.radio ?? camper.радио);

  const featureBadges: FeatureBadge[] = [];

  if (transmissionValue) {
    featureBadges.push({
      key: "transmission",
      label:
        transmissionValue === "automatic" ? "Automatic" : transmissionValue,
      iconId: transmissionValue === "automatic" ? "Automatic" : undefined,
    });
  }

  if (hasAC) {
    featureBadges.push({
      key: "AC",
      label: "AC",
      iconId: "AC",
    });
  }

  if (engineValue) {
    const normalized = engineValue.toLowerCase();

    // Підпис для бейджу
    let engineLabel = "";
    let engineIconId: string | undefined;

    if (normalized === "petrol") {
      engineLabel = "Petrol";
      engineIconId = "Petrol";
    } else if (normalized === "gas") {
      engineLabel = "Gas";
      engineIconId = "Gas"; // іконка Gas з твого sprite.svg
    }

    if (engineLabel) {
      featureBadges.push({
        key: "engine",
        label: engineLabel,
        iconId: engineIconId,
      });
    }
  }

  if (hasKitchen) {
    featureBadges.push({
      key: "kitchen",
      label: "Kitchen",
      iconId: "Kitchen",
    });
  }

  if (hasTV) {
    featureBadges.push({
      key: "TV",
      label: "TV",
      iconId: "TV",
    });
  }

  if (hasRadio) {
    featureBadges.push({
      key: "radio",
      label: "Radio",
      iconId: "Radio",
    });
  }

  if (hasBathroom) {
    featureBadges.push({
      key: "bathroom",
      label: "Bathroom",
      iconId: "Bathroom",
    });
  }

  return (
    <main className={css.main}>
      <Container>
        <section className={css.details}>
          <header className={css.header}>
            <h1 className={css.title}>{camper.name}</h1>

            <div className={css.subRow}>
              <button type="button" className={css.linkLike}>
                <span className={css.star}>★</span>
                <span className={css.rating}>
                  {rating.toFixed(1)}{" "}
                  <span className={css.reviews}>({reviewsCount} Reviews)</span>
                </span>
              </button>

              <span className={css.dot}>•</span>

              <span className={css.location}>{camper.location}</span>
            </div>

            <p className={css.price}>€{camper.price.toFixed(2)}</p>
          </header>

          {gallery.length > 0 && (
            <div className={css.gallery}>
              {gallery.map((item, index) => {
                const src: string = item.original || item.thumb;
                const alt: string = `${camper.name} photo ${index + 1}`;

                return (
                  <div key={src + index.toString()} className={css.galleryItem}>
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className={css.galleryImage}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <p className={css.description}>{camper.description}</p>

          <div className={css.tabsRow}>
            <button
              type="button"
              className={`${css.tabButton} ${
                activeTab === "features" ? css.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("features")}
            >
              Features
            </button>

            <button
              type="button"
              className={`${css.tabButton} ${
                activeTab === "reviews" ? css.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          <div className={css.tabDivider} />
          <div className={css.contentRow}>
            <div className={css.leftPanel}>
              {activeTab === "features" && (
                <>
                  <ul className={css.badgesList}>
                    {featureBadges.map(badge => (
                      <li key={badge.key} className={css.badge}>
                        {badge.iconId && (
                          <svg
                            className={css.badgeIcon}
                            width={20}
                            height={20}
                            aria-hidden="true"
                          >
                            <use href={`/icons/sprite.svg#${badge.iconId}`} />
                          </svg>
                        )}
                        <span>{badge.label}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={css.detailsBlock}>
                    <h2 className={css.detailsTitle}>Vehicle details</h2>

                    <dl className={css.detailsList}>
                      {formValue && (
                        <div className={css.detailsRow}>
                          <dt>Form</dt>
                          <dd>{formValue}</dd>
                        </div>
                      )}

                      {lengthValue && (
                        <div className={css.detailsRow}>
                          <dt>Length</dt>
                          <dd>{lengthValue}</dd>
                        </div>
                      )}

                      {widthValue && (
                        <div className={css.detailsRow}>
                          <dt>Width</dt>
                          <dd>{widthValue}</dd>
                        </div>
                      )}

                      {heightValue && (
                        <div className={css.detailsRow}>
                          <dt>Height</dt>
                          <dd>{heightValue}</dd>
                        </div>
                      )}

                      {tankValue && (
                        <div className={css.detailsRow}>
                          <dt>Tank</dt>
                          <dd>{tankValue}</dd>
                        </div>
                      )}

                      {consumptionValue && (
                        <div className={css.detailsRow}>
                          <dt>Consumption</dt>
                          <dd>{consumptionValue}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </>
              )}

              {activeTab === "reviews" && (
                <div className={css.reviewsBlock}>
                  {camper.reviews && camper.reviews.length > 0 ? (
                    <ul className={css.reviewsList}>
                      {camper.reviews.map(review => (
                        <li
                          key={`${review.reviewer_name}-${review.comment}`}
                          className={css.reviewItem}
                        >
                          <div className={css.reviewHeader}>
                            <div className={css.reviewAvatar}>
                              {review.reviewer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={css.reviewName}>
                                {review.reviewer_name}
                              </p>
                              <p className={css.reviewRating}>
                                <span className={css.star}>★</span>{" "}
                                {review.reviewer_rating.toFixed(1)}
                              </p>
                            </div>
                          </div>
                          <p className={css.reviewText}>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={css.mutedText}>There are no reviews yet.</p>
                  )}
                </div>
              )}
            </div>

            <aside className={css.booking}>
              <h2 className={css.bookingTitle}>Book your campervan now</h2>
              <p className={css.bookingSubtitle}>
                Stay connected! We are always ready to help you.
              </p>

              <form className={css.form} onSubmit={handleSubmit}>
                <input
                  className={css.input}
                  name="name"
                  type="text"
                  placeholder="Name*"
                  required
                />
                <input
                  className={css.input}
                  name="email"
                  type="email"
                  placeholder="Email*"
                  required
                />
                <input
                  className={css.input}
                  name="date"
                  type="date"
                  placeholder="Booking date*"
                  required
                />
                <textarea
                  className={css.textarea}
                  name="comment"
                  placeholder="Comment"
                  rows={4}
                />

                <button type="submit" className={css.submitBtn}>
                  Send
                </button>

                {isBooked && (
                  <p className={css.successMessage}>
                    Booking request has been sent!
                  </p>
                )}
              </form>
            </aside>
          </div>
        </section>
      </Container>
    </main>
  );
}

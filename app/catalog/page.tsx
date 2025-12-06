"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import { useCampersStore } from "@/lib/store/campersStore";

export default function CatalogPage() {
  const { campers, page, isLoading, error, hasMore, loadCampers } =
    useCampersStore();

  // перше завантаження
  useEffect(() => {
    loadCampers({ page: 1 }, { append: false });
  }, [loadCampers]);

  const handleLoadMore = () => {
    loadCampers({ page: page + 1 }, { append: true });
  };

  return (
    <main>
      <Container>
        <h1>Campers catalog</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {campers.map(camper => (
            <li
              key={camper.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              {/* Фото */}
              {camper.gallery?.[0]?.thumb && (
                <div style={{ flexShrink: 0, width: 290, height: 310 }}>
                  <Image
                    src={camper.gallery[0].thumb}
                    alt={camper.name}
                    width={290}
                    height={310}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </div>
              )}

              {/* Текстова частина */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    gap: 16,
                  }}
                >
                  <h2 style={{ margin: 0 }}>{camper.name}</h2>
                  <span style={{ fontWeight: 600 }}>
                    €{camper.price.toFixed(2)}
                  </span>
                </div>

                <p style={{ margin: "4px 0" }}>
                  <strong>Location:</strong> {camper.location}
                </p>
                <p style={{ margin: "4px 0 12px" }}>
                  <strong>Rating:</strong> {camper.rating}
                </p>

                <p style={{ margin: "0 0 16px" }}>{camper.description}</p>

                <Link
                  href={`/catalog/${camper.id}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 26px",
                    borderRadius: 100,
                    backgroundColor: "#e44848",
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Show more
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Load more */}
        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            style={{
              display: "block",
              margin: "0 auto 40px",
              padding: "10px 26px",
              borderRadius: 100,
              border: "none",
              backgroundColor: "#e44848",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLoading ? "Loading..." : "Load more"}
          </button>
        )}
      </Container>
    </main>
  );
}

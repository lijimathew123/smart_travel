import React from "react";

const glassCard = {
  background: "linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.08) 100%)",
  border: "1px solid rgba(239,68,68,0.35)",
  borderRadius: "16px",
  backdropFilter: "blur(12px)",
};

export default function EmergencyContactCard({ place, index = 0 }) {
  if (!place) return null;

  const phone = place.phone;
  const hasPhone = typeof phone === "string" && phone.trim().length > 0;
  const address = place.address;
  const name = place.name || place.title || "Unnamed";

  const typeLabel = place.type
    ? place.type.charAt(0).toUpperCase() + place.type.slice(1)
    : "Emergency";

  const lat = place.lat;
  const lon = place.lon;
  const mapsUrl =
    typeof lat === "number" && typeof lon === "number"
      ? `https://www.google.com/maps?q=${lat},${lon}`
      : null;

  return (
    <div
      style={{
        ...glassCard,
        padding: "1.25rem 1.25rem",
        transition: "transform 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(245,158,11,0.55)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: "0.98rem",
              fontWeight: 800,
              color: "#fecaca",
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {name}
          </h4>
          <div
            style={{
              marginTop: "6px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "999px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {typeLabel}
            </span>
            {typeof index === "number" && (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "rgba(245,158,11,0.10)",
                  border: "1px solid rgba(245,158,11,0.20)",
                  color: "#fbbf24",
                }}
              >
                #{index + 1}
              </span>
            )}
          </div>
        </div>
      </div>

      {address && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(254,202,202,0.8)",
            margin: "0 0 10px",
            lineHeight: 1.35,
          }}
        >
          {address}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {hasPhone && (
          <a
            href={`tel:${phone}`}
            style={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: 800,
              background: "rgba(239,68,68,0.22)",
              border: "1px solid rgba(239,68,68,0.30)",
              padding: "8px 10px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            Call: {phone}
          </a>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "none",
              color: "#111827",
              fontWeight: 900,
              background: "rgba(245,158,11,0.9)",
              border: "1px solid rgba(245,158,11,0.6)",
              padding: "8px 10px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            Open in Maps
          </a>
        )}
      </div>
    </div>
  );
}


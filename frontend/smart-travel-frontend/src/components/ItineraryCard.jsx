import React from "react";

export default function ItineraryCard({ itinerary }) {
  return (
    <div>
      <h3>Itinerary</h3>
      <pre>{JSON.stringify(itinerary, null, 2)}</pre>
    </div>
  );
}
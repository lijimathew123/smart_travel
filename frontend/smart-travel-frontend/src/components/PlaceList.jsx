import React from "react";

export default function PlaceList({ places }) {
  return (
    <ul>
      {places.map((place, index) => (
        <li key={place.id || index}>{place.name}</li>
      ))}
    </ul>
  );
}
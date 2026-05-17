import React from "react";

export default function WeatherCard({ weather }) {
  return (
    <div>
      <h3>Weather</h3>
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
}
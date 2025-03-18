import React, { createContext, useState } from "react";

export const SeasonsContext = createContext();

export default function SeasonsProvider({ children }) {
  const [season, setSeason] = useState("spring");

  const toggleSeason = () => {
    setSeason((prev) => {
      if (prev === "spring") return "summer";
      if (prev === "summer") return "winter";
      return "spring";
    });
  };

  return (
    <SeasonsContext.Provider value={{ season, toggleSeason }}>
      {children}
    </SeasonsContext.Provider>
  );
}

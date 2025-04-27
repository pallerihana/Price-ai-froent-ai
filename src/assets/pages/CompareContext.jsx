// src/context/CompareContext.jsx
import React, { createContext, useState } from "react";

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (item) => {
    setCompareItems((prev) => {
      // Avoid duplicates
      const isExist = prev.find((i) => i.id === item.id);
      if (isExist) return prev;
      return [...prev, item];
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

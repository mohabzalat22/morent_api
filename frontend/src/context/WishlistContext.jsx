import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (car) => {
    setWishlist((prev) => {
      if (!prev.find((item) => item.id === car.id)) {
        return [...prev, car];
      }
      return prev;
    });
  };

  const removeFromWishlist = (carId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== carId));
  };

  const isInWishlist = (carId) => wishlist.some((item) => item.id === carId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

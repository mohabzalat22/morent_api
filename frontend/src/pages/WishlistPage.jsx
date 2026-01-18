import React from "react";
import { useWishlist } from "../context/WishlistContext";
import CarCard from "../components/CarCard";

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto lg:p-16 p-4">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">No cars in your wishlist yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {wishlist.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;

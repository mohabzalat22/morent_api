import React from "react";
import StarIcon from "./icons/StarIcon";
import StarOutlineIcon from "./icons/StarOutlineIcon";

function ReviewItem({ item, car, onEdit, onDelete, deleting }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
                <div className="w-20 h-14 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-600">
                    {car && car.image ? (
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain p-1"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                        {car ? car.name : `Car #${item.car_id}`}
                    </h4>
                    <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: item.stars }).map((_, i) => (
                            <StarIcon
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-current"
                            />
                        ))}
                        {Array.from({ length: 5 - item.stars }).map((_, i) => (
                            <StarOutlineIcon
                                key={i}
                                className="w-4 h-4 text-gray-300"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                "{item.review}"
            </p>
            <div className="flex gap-2 self-end mt-2">
                <button
                    className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold hover:bg-yellow-600"
                    onClick={onEdit}
                    disabled={deleting}
                >
                    Edit
                </button>
                <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                    onClick={onDelete}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default ReviewItem;

import React from "react";

function ReservationItem({ item, car, onEdit, onDelete, deleting, showEdit }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow">
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:gap-8">
                    <div>
                        <div className="text-gray-500 text-xs">
                            Pick Location
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {item.pick_location}
                        </div>
                        <div className="text-gray-400 text-xs">
                            {item.start_time}
                        </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <div className="text-gray-500 text-xs">
                            Drop Location
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {item.drop_location}
                        </div>
                        <div className="text-gray-400 text-xs">
                            {item.end_time}
                        </div>
                    </div>
                </div>
                {car && (
                    <div className="my-2 py-2 flex items-center gap-2">
                        {car.image && (
                            <img
                                src={car.image}
                                alt={car.name}
                                className="max-w-30 h-10 object-cover rounded"
                            />
                        )}
                        <div>
                            <div className="font-bold text-blue-700">
                                {car.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {car.brand}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col gap-2 items-end">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    Reservation #{item.displayIndex}
                </span>
                <div className="flex gap-2 mt-2">
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
        </div>
    );
}

export default ReservationItem;

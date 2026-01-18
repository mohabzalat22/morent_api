import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import StarIcon from "../components/icons/StarIcon";
import StarOutlineIcon from "../components/icons/StarOutlineIcon";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext.jsx";
import ReservationItem from "../components/ReservationItem";
import ReviewItem from "../components/ReviewItem";
import ConfirmModal from "../components/ConfirmModal";
import { showToast } from "../utils/toast";

function ProfilePage() {
    const { logout, user, refreshUser } = useAuth();
    // Tab state
    const [activeTab, setActiveTab] = useState("profile");
    // Profile edit state
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editImage, setEditImage] = useState(null);
    // Sync edit fields with user when user changes
    useEffect(() => {
        setEditName(user?.name || "");
        setEditEmail(user?.email || "");
    }, [user]);
    const [isSaving, setIsSaving] = useState(false);
    // Pagination state
    const [reservations, setReservations] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });
    const [reservationsCars, setReservationsCars] = useState({});
    const [reviews, setReviews] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    });
    const [reviewsCars, setReviewsCars] = useState({});
    const [reservationsPage, setReservationsPage] = useState(1);
    const [reviewsPage, setReviewsPage] = useState(1);
    // Modal state for account deletion
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    // Track deleting reservation/review
    const [deletingReservationId, setDeletingReservationId] = useState(null);
    const [deletingReviewId, setDeletingReviewId] = useState(null);
    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: null,
        id: null,
    });
    // Edit modal state (stub)
    const [editReservationId, setEditReservationId] = useState(null);
    const [editReviewId, setEditReviewId] = useState(null);
    // Delete reservation (with modal)
    const handleDeleteReservation = async (id) => {
        setDeletingReservationId(id);
        try {
            const res = await api.delete(`/reservations/${id}`);
            if (res.data.success) {
                showToast(res.data);
                setReservationsPage(1);
            }
        } catch (error) {
            showToast(error, true);
        }
        setDeletingReservationId(null);
        setConfirmModal({ open: false, type: null, id: null });
    };

    // Delete review (with modal)
    const handleDeleteReview = async (id) => {
        setDeletingReviewId(id);
        try {
            // Find the review item to get car_id
            const review = reviews.data.find((r) => r.id === id);
            if (!review) throw new Error("Review not found");
            const carId = review.car_id;
            const res = await api.delete(`/cars/${carId}/reviews/${id}`);
            if (res.data.success) {
                showToast(res.data);
                setReviewsPage(1);
            }
        } catch (error) {
            showToast(error, true);
        }
        setDeletingReviewId(null);
        setConfirmModal({ open: false, type: null, id: null });
    };

    // Open edit modal (stub)
    const handleEditReservation = (id) => {
        setEditReservationId(id);
        // TODO: Open reservation edit modal
    };
    // Edit modal state for reviews
    const [editReviewModal, setEditReviewModal] = useState({
        open: false,
        id: null,
        review: "",
        stars: 1,
    });

    // Open edit modal for review
    const handleEditReview = (id) => {
        const review = reviews.data.find((r) => r.id === id);
        if (!review) return;
        setEditReviewModal({
            open: true,
            id,
            review: review.review,
            stars: review.stars,
        });
    };

    // Submit review edit
    const handleSubmitEditReview = async () => {
        const { id, review, stars } = editReviewModal;
        try {
            const reviewItem = reviews.data.find((r) => r.id === id);
            if (!reviewItem) throw new Error("Review not found");
            const carId = reviewItem.car_id;
            const res = await api.put(`/cars/${carId}/reviews/${id}`, {
                review,
                stars,
            });
            if (res.data.success) {
                showToast(res.data);
                setReviewsPage(1);
                setEditReviewModal({
                    open: false,
                    id: null,
                    review: "",
                    stars: 1,
                });
            }
        } catch (error) {
            showToast(error, true);
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        try {
            const res = await api.delete("/profile");
            if (res.data.success) {
                showToast(res.data);
                await logout();
                navigate("/register");
            }
        } catch (error) {
            showToast(error, true);
        }
        setIsDeletingAccount(false);
        setShowDeleteModal(false);
    };
    const limit = 6; // Items per page
    const navigate = useNavigate();

    const fetchCarById = async (carId) => {
        try {
            const res = await api.get(`/cars/${carId}`);
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (err) {
            console.error("Error fetching car data for id", carId, err);
            return null;
        }
    };

    // Fetch paginated reservations and reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(
                    `/profile?reservations_page=${reservationsPage}&reviews_page=${reviewsPage}&limit=${limit}`,
                );
                if (res.data && res.data.success) {
                    const profileData = res.data.data;
                    setReservations(
                        profileData.reservations || {
                            data: [],
                            current_page: 1,
                            last_page: 1,
                            total: 0,
                            per_page: limit,
                        },
                    );
                    setReviews(
                        profileData.reviews || {
                            data: [],
                            current_page: 1,
                            last_page: 1,
                            total: 0,
                            per_page: limit,
                        },
                    );

                    // Fetch car data for reservations
                    const reservationCarIds = (
                        profileData.reservations?.data || []
                    ).map((r) => r.car_id);
                    const uniqueReservationCarIds = [
                        ...new Set(reservationCarIds),
                    ];
                    const reservationCarData = {};
                    await Promise.all(
                        uniqueReservationCarIds.map(async (carId) => {
                            reservationCarData[carId] =
                                await fetchCarById(carId);
                        }),
                    );
                    setReservationsCars(reservationCarData);

                    // Fetch car data for reviews
                    const reviewCarIds = (profileData.reviews?.data || []).map(
                        (r) => r.car_id,
                    );
                    const uniqueReviewCarIds = [...new Set(reviewCarIds)];
                    const reviewCarData = {};
                    await Promise.all(
                        uniqueReviewCarIds.map(async (carId) => {
                            reviewCarData[carId] = await fetchCarById(carId);
                        }),
                    );
                    setReviewsCars(reviewCarData);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchData();
    }, [reservationsPage, reviewsPage]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setEditImage(file);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        formData.append("name", editName);
        formData.append("email", editEmail);
        if (editImage) formData.append("image", editImage);
        formData.append("_method", "PUT");
        try {
            const res = await api.post("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                showToast(res.data);
                await refreshUser();
            }
        } catch (error) {
            console.error("Profile update error:", error);
            showToast(error, true);
        }
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="flex flex-1 w-full max-w-7xl mx-auto py-8 px-2 gap-8">
                {/* Sidebar: Profile Info */}
                <aside className="w-72 min-w-[220px] max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center sticky top-8 self-start h-fit">
                    {/* Profile Info Inline */}
                    {user && (
                        <>
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow mb-4 bg-white flex items-center justify-center">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <div className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                    {user.name}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {user.email}
                                </div>
                            </div>
                            <div className="mt-6 w-full flex flex-col gap-2">
                                <button
                                    className={`w-full px-4 py-2 rounded-lg font-bold shadow transition bg-blue-600 text-white hover:bg-blue-700`}
                                    onClick={() => setActiveTab("profile")}
                                >
                                    Edit Profile
                                </button>
                                <button
                                    className={`w-full px-4 py-2 rounded-lg font-bold shadow transition bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    onClick={() => setActiveTab("reservations")}
                                >
                                    Reservations
                                </button>
                                <button
                                    className={`w-full px-4 py-2 rounded-lg font-bold shadow transition bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600`}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    Reviews
                                </button>
                                <button
                                    className="w-full px-4 py-2 rounded-lg font-bold shadow transition bg-red-600 text-white hover:bg-red-700 mt-2"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Account
                                </button>
                                <button
                                    className="w-full px-4 py-2 rounded-lg font-bold shadow transition bg-gray-300 text-gray-700 hover:bg-gray-400 mt-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </aside>
                {/* Main Content */}
                <main className="flex-1 flex flex-col gap-8">
                    {activeTab === "profile" && (
                        <section>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                                Edit Profile
                            </h3>
                            <form
                                className="max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4"
                                onSubmit={handleProfileSave}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow mb-2 bg-white flex items-center justify-center">
                                            {editImage ? (
                                                <img
                                                    src={URL.createObjectURL(
                                                        editImage,
                                                    )}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : user?.image ? (
                                                <img
                                                    src={user.image}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                                    {user?.name?.charAt(0) ||
                                                        "U"}
                                                </div>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="edit-profile-image-upload"
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 mb-2"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                                />
                                            </svg>
                                        </label>
                                        <input
                                            type="file"
                                            id="edit-profile-image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={editName}
                                        onChange={(e) =>
                                            setEditName(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={editEmail}
                                        onChange={(e) =>
                                            setEditEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </section>
                    )}
                    {activeTab === "reservations" && (
                        <section>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                                Reservations
                            </h3>
                            <div className="space-y-4">
                                {reservations.data.length === 0 ? (
                                    <div className="text-gray-400">
                                        No reservations found.
                                    </div>
                                ) : (
                                    reservations.data.map((item, index) => (
                                        <ReservationItem
                                            key={item.id || index}
                                            item={{
                                                ...item,
                                                displayIndex:
                                                    reservations.per_page *
                                                        (reservations.current_page -
                                                            1) +
                                                    index +
                                                    1,
                                            }}
                                            car={reservationsCars[item.car_id]}
                                            onEdit={() =>
                                                handleEditReservation(item.id)
                                            }
                                            onDelete={() =>
                                                setConfirmModal({
                                                    open: true,
                                                    type: "reservation",
                                                    id: item.id,
                                                })
                                            }
                                            deleting={
                                                deletingReservationId ===
                                                item.id
                                            }
                                        />
                                    ))
                                )}
                                {reservations.last_page > 1 && (
                                    <div className="flex gap-2 justify-center mt-4">
                                        <button
                                            disabled={
                                                reservations.current_page === 1
                                            }
                                            onClick={() =>
                                                setReservationsPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-2 py-1">
                                            Page {reservations.current_page} of{" "}
                                            {reservations.last_page}
                                        </span>
                                        <button
                                            disabled={
                                                reservations.current_page ===
                                                reservations.last_page
                                            }
                                            onClick={() =>
                                                setReservationsPage((p) =>
                                                    Math.min(
                                                        reservations.last_page,
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeTab === "reviews" && (
                        <section>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                                My Reviews
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.data.length === 0 ? (
                                    <div className="text-gray-400 col-span-full">
                                        No reviews found.
                                    </div>
                                ) : (
                                    reviews.data.map((item, index) => (
                                        <ReviewItem
                                            key={item.id || index}
                                            item={item}
                                            car={reviewsCars[item.car_id]}
                                            onEdit={() =>
                                                handleEditReview(item.id)
                                            }
                                            onDelete={() =>
                                                setConfirmModal({
                                                    open: true,
                                                    type: "review",
                                                    id: item.id,
                                                })
                                            }
                                            deleting={
                                                deletingReviewId === item.id
                                            }
                                        />
                                    ))
                                )}
                            </div>
                            {/* Edit Review Modal */}
                            {editReviewModal.open && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
                                        <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
                                            Edit Review
                                        </h4>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
                                                Review
                                            </label>
                                            <textarea
                                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={editReviewModal.review}
                                                onChange={(e) =>
                                                    setEditReviewModal(
                                                        (modal) => ({
                                                            ...modal,
                                                            review: e.target
                                                                .value,
                                                        }),
                                                    )
                                                }
                                                rows={3}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">
                                                Stars
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={editReviewModal.stars}
                                                onChange={(e) =>
                                                    setEditReviewModal(
                                                        (modal) => ({
                                                            ...modal,
                                                            stars: Number(
                                                                e.target.value,
                                                            ),
                                                        }),
                                                    )
                                                }
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <option
                                                        key={star}
                                                        value={star}
                                                    >
                                                        {star}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                className="px-4 py-2 rounded-lg font-bold bg-gray-300 text-gray-700 hover:bg-gray-400"
                                                onClick={() =>
                                                    setEditReviewModal({
                                                        open: false,
                                                        id: null,
                                                        review: "",
                                                        stars: 1,
                                                    })
                                                }
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={handleSubmitEditReview}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                    <ConfirmModal
                        open={showDeleteModal}
                        title="Delete Account"
                        message="Are you sure you want to delete your account? This action cannot be undone."
                        onConfirm={handleDeleteAccount}
                        onCancel={() => setShowDeleteModal(false)}
                        confirmText="Delete Account"
                        cancelText="Cancel"
                        loading={isDeletingAccount}
                    />
                    <ConfirmModal
                        open={
                            confirmModal.open &&
                            confirmModal.type === "reservation"
                        }
                        title="Delete Reservation"
                        message="Are you sure you want to delete this reservation? This action cannot be undone."
                        onConfirm={() =>
                            handleDeleteReservation(confirmModal.id)
                        }
                        onCancel={() =>
                            setConfirmModal({
                                open: false,
                                type: null,
                                id: null,
                            })
                        }
                        confirmText="Delete"
                        cancelText="Cancel"
                        loading={deletingReservationId === confirmModal.id}
                    />
                    <ConfirmModal
                        open={
                            confirmModal.open && confirmModal.type === "review"
                        }
                        title="Delete Review"
                        message="Are you sure you want to delete this review? This action cannot be undone."
                        onConfirm={() => handleDeleteReview(confirmModal.id)}
                        onCancel={() =>
                            setConfirmModal({
                                open: false,
                                type: null,
                                id: null,
                            })
                        }
                        confirmText="Delete"
                        cancelText="Cancel"
                        loading={deletingReviewId === confirmModal.id}
                    />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default ProfilePage;

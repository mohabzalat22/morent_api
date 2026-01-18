import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import StarIcon from "../components/icons/StarIcon";
import StarOutlineIcon from "../components/icons/StarOutlineIcon";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext.jsx";
import { showToast } from "../utils/toast";

function ProfilePage() {
  const { logout, user, refreshUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [reservationsCars, setReservationsCars] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsCars, setReviewsCars] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/profile");
        if (res.data && res.data.success) {
          const profileData = res.data.data;
          setReservations(profileData.reservations || []);
          setReviews(profileData.reviews || []);
          console.log(profileData.reviews);

          // Fetch car data for reservations
          const reservationCarIds = (profileData.reservations || []).map(
            (r) => r.car_id,
          );
          const uniqueReservationCarIds = [...new Set(reservationCarIds)];
          const reservationCarData = {};
          await Promise.all(
            uniqueReservationCarIds.map(async (carId) => {
              reservationCarData[carId] = await fetchCarById(carId);
            }),
          );
          setReservationsCars(reservationCarData);

          // Fetch car data for reviews
          const reviewCarIds = (profileData.reviews || []).map((r) => r.car_id);
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
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", user.name);
    formData.append("email", user.email);
    // Workaround for PHP/Laravel PUT with multi-part form data
    formData.append("_method", "PUT");

    try {
      const res = await api.post("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        showToast(res.data);
        await refreshUser();
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast(error, true);
    }
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
                <label
                  htmlFor="profile-image-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 mb-4"
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
                  id="profile-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>
              <nav className="flex flex-col gap-2 w-full">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
                  Reservations
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
                  Reviews
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
                  Payments
                </button>
              </nav>
            </>
          )}
          <div className="mt-8 flex flex-col gap-2 w-full">
            <Link to="/">
              <button className="w-full bg-blue-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Log out
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Reservations Section */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Reservations
            </h3>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-gray-400">No reservations found.</div>
              ) : (
                reservations.map((item, index) => {
                  const car = reservationsCars[item.car_id];
                  return (
                    <div
                      key={item.id || index}
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow"
                    >
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
                      <div className="mt-4 md:mt-0 flex-shrink-0">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                          Reservation #{index + 1}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              My Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.length === 0 ? (
                <div className="text-gray-400 col-span-full">No reviews found.</div>
              ) : (
                reviews.map((item, index) => {
                  const car = reviewsCars[item.car_id];
                  return (
                    <div
                      key={item.id || index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
                    >
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
                              <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            {Array.from({ length: 5 - item.stars }).map((_, i) => (
                              <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                        "{item.review}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Payments Section (Placeholder) */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Payments
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-400 text-center">
              Payment history and details coming soon.
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;

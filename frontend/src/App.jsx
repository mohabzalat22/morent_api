import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import DetailPage from "./pages/DetailPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import BillingInfo from "./components/payment/BillingInfo";
import RentalInfo from "./components/payment/RentalInfo";
import PaymentMethod from "./components/payment/PaymentMethod";
import Confirmation from "./components/payment/Confirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";

// Layout with Navbar and Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

// Layout without Navbar and Footer (for auth pages)
const AuthLayout = () => {
  return <Outlet />;
};

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Auth routes without navbar/footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Main routes with navbar/footer */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <ProtectedRoute>
                <DetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<BillingInfo />} />
            <Route path="step/1" element={<BillingInfo />} />
            <Route path="step/2" element={<RentalInfo />} />
            <Route path="step/3" element={<PaymentMethod />} />
            <Route path="step/4" element={<Confirmation />} />
          </Route>
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

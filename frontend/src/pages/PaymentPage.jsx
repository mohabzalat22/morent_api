import { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import RentalSummary from "../components/payment/RentalSummary";
import api from "../api/api";

function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch car details
        const carRes = await api.get(`/cars/${id}`);
        if (carRes.data.success) setCar(carRes.data.data);
        // Fetch reviews
        const reviewRes = await api.get(`/cars/${id}/reviews`);
        if (reviewRes.data.success) setReviews(reviewRes.data.data);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const nextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      navigate(`/payment/${id}/step/${newStep}`);
    }
  };

  const backStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      navigate(`/payment/${id}/step/${newStep}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12">
        <div className="col-start-1 col-span-7">
          <div className="my-4">
            <Outlet />
          </div>
          <div className="bg-white p-4 flex justify-end rounded-md">
            <button
              className="bg-blue-600 py-2 px-6 mx-2 text-white text-lg rounded-md"
              onClick={backStep}
            >
              Back
            </button>
            <button
              className="bg-blue-600 py-2 px-6 mx-2 text-white text-lg rounded-md"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>
        <div className="col-start-8 col-span-5 lg:px-4">
          {!loading && car && (
            <RentalSummary car={car} reviews={reviews} className="my-4" />
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;

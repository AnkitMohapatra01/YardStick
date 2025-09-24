
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/getMe`,
          { withCredentials: true }
        );
        localStorage.setItem("tenant", JSON.stringify(res.data.userData.tenant));
      } catch (error) {
        console.error("Error fetching tenant:", error);
      }
    };
    fetchTenant();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-600">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* ✅ Checkmark Icon */}
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Payment Successful 🎉</h1>
          <p className="text-gray-600">
            Your plan has been upgraded successfully. You now have access to{" "}
            <span className="font-semibold text-green-600">Pro Features</span>.
          </p>

          {/* ✅ Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

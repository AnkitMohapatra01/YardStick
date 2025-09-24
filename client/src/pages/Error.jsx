import { useNavigate } from "react-router-dom";

export const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-600">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* ❌ Error Icon */}
          <div className="bg-red-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Oops! Something went wrong 😢</h1>
          <p className="text-gray-600">
            We couldn’t process your request. Please try again or go back to the previous page.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("..")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

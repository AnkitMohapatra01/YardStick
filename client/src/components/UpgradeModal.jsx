export const UpgradeModal = ({ setShowUpgrade }) => {
  const role = JSON.parse(localStorage.getItem("role"));
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          Upgrade Required 🚀
        </h2>
        <p className="text-gray-600 mb-6">
          You are on the <span className="font-semibold">Free Plan</span> and
          can only create up to 3 notes. Upgrade to{" "}
          <span className="font-semibold">Pro</span> for unlimited notes!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowUpgrade(false)}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Cancel
          </button>
          {role === "Admin" && (
            <button
              onClick={() => {
                setShowUpgrade(false);
                // 🔗 redirect to upgrade page
                window.location.href = "/upgrade";
              }}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

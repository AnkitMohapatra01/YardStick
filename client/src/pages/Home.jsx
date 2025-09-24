import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { NoteModal } from "../components/NoteModal";
import { UpgradeModal } from "../components/UpgradeModal"; // ⬅️ new component
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export const Home = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(AppContext);
  const [notes, setNotes] = useState([]);
  const [addNote, setAddNote] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false); // ⬅️ state for upgrade modal

  const plan = JSON.parse(localStorage.getItem("tenant")).plan;
  const role = JSON.parse(localStorage.getItem("role"));
  const tenant = JSON.parse(localStorage.getItem("tenant")).name;
  const upgradePlan = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tenants/${tenant}/upgrade`,
        {},
        { withCredentials: true }
      );
      window.location.href = res.data.url; // redirect to Stripe checkout
      // console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // console.log("Plan:", plan);

  const getAllNotes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/my-notes`,
        { withCredentials: true }
      );
      // console.log(res);
      setNotes(res.data.note || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("tenant");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotes();
  }, [notes]);

  // ⬇️ callback to add new note to state
  const handleNewNote = (newNote) => {
    setNotes((prev) => [...prev, newNote]);
  };

  // ⬇️ Add note button logic
  const handleAddNoteClick = () => {
    if (plan === "Free" && notes.length >= 3) {
      setShowUpgrade(true); // show upgrade modal instead of NoteModal
    } else {
      setAddNote(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            My Notes
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleAddNoteClick}
              className="mx-2 bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              + Add Note
            </button>
            {role === "Admin" && plan === "Free" && (
              <button
                onClick={() => {
                  setShowUpgrade(false);
                  // 🔗 redirect to upgrade page
                  upgradePlan();
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
              >
                Upgrade Now
              </button>
            )}
            <button
              onClick={logout}
              className="mx-2 bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((currNote, index) => (
              <NoteCard
                key={index}
                currNote={currNote}
                onDelete={(id) =>
                  setNotes((prev) => prev.filter((n) => n._id !== id))
                }
                onEdit={(updatedNote) =>
                  setNotes((prev) =>
                    prev.map((n) =>
                      n._id === updatedNote._id ? updatedNote : n
                    )
                  )
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-white text-lg mt-10">
            No notes available. Start by adding a new note!
          </p>
        )}

        {/* Add Note Modal */}
        {addNote && (
          <NoteModal
            addNote={addNote}
            setAddNote={setAddNote}
            handleNewNote={handleNewNote}
          />
        )}

        {/* Upgrade Modal */}
        {showUpgrade && <UpgradeModal setShowUpgrade={setShowUpgrade} />}
      </div>
    </div>
  );
};

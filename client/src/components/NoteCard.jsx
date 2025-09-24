import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export const NoteCard = ({ currNote, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false); // 👈 new modal state
  const [editData, setEditData] = useState({
    title: currNote.title,
    content: currNote.content,
  });

  // 🗑️ Delete
  const deleteNote = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/notes/${currNote._id}`,
        { withCredentials: true }
      );
      toast.success("Note deleted!");
      onDelete(currNote._id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  // ✏️ Save edits
  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/notes/${currNote._id}`,
        editData,
        { withCredentials: true }
      );
      toast.success("Note updated!");
      onEdit(res.data.note);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
        {isEditing ? (
          <>
            <input
              className="w-full border p-2 mb-2 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 rounded"
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {currNote.title}
            </h2>
            <p className="text-gray-600 mb-3 line-clamp-3">
              {currNote.content}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>📅 {new Date(currNote.createdAt).toLocaleDateString()}</span>
              {currNote.tenant && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs">
                  {currNote.tenant.name}
                </span>
              )}
              {currNote.createdBy && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs">
                  {currNote.createdBy.email}
                </span>
              )}
              {currNote.createdBy && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs">
                  {currNote.createdBy.role}
                </span>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsViewing(true)} // 👈 open modal
                className="bg-purple-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={deleteNote}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* 👇 View Modal */}
      {isViewing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-wrap">
              {currNote.title}
            </h2>
            <p className="text-gray-700 break-words whitespace-pre-wrap">
              {currNote.content}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsViewing(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import axios from "axios";
import { useState } from "react";

export const NoteModal = ({ addNote,setAddNote,handleNewNote }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/note/notes`,
        formData,
        { withCredentials: true }
      );
      const newNote=res.data.note;
      handleNewNote && handleNewNote(newNote);
      setAddNote(!addNote);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={()=>setAddNote(!addNote)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Add New Note
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter note title"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Content
            </label>
            <textarea
              name="content"
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Write your note here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Save Note
          </button>
        </form>
      </div>
    </div>
  );
};

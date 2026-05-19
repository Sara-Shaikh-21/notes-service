import { useEffect, useState } from "react";
import stickyNotesImg from "../src/assets/Sticky_Notes.png";
const API_URL = "https://notes-service-2wmw.onrender.com";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [shareEmails, setShareEmails] = useState({});
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      console.log("Notes response:", data);

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error(error);
      setNotes([]);
    }
  };
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, []);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful");
        fetchNotes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        setNoteData({ title: "", content: "" });
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${API_URL}/search?q=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      console.log("Search results:", data);

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleShare = async (id) => {
    const email = shareEmails[id];

    if (!email) {
      alert("Enter email to share");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notes/${id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            share_with_email: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Note shared successfully");

        setShareEmails({
          ...shareEmails,
          [id]: "",
        });
      } else {
        alert(data.message || "Sharing failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-200">
              <img
                src={stickyNotesImg}
                alt="Sticky Notes"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div>
              <h1 className="text-5xl font-black text-[#3b3b3b] tracking-tight">
                Sticky Notes
              </h1>

              <p className="text-gray-500 mt-1 text-lg">
                Organize your ideas beautifully
              </p>
            </div>
          </div>

          {token && (
            <button
              onClick={logout}
              className="bg-black text-white px-5 py-2 rounded-2xl"
            >
              Logout
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 rounded-xl"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-6 border border-gray-100">
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              Create Note
            </h2>

            <p className="text-gray-500 mb-6">
              Capture your thoughts instantly
            </p>

            <input
              type="text"
              placeholder="Note title..."
              value={noteData.title}
              onChange={(e) =>
                setNoteData({
                  ...noteData,
                  title: e.target.value,
                })
              }
              className="w-full bg-gray-100 rounded-2xl px-4 py-4 mb-4 outline-none border-none"
            />

            <textarea
              rows="8"
              placeholder="Write something amazing..."
              value={noteData.content}
              onChange={(e) =>
                setNoteData({
                  ...noteData,
                  content: e.target.value,
                })
              }
              className="w-full bg-gray-100 rounded-2xl px-4 py-4 mb-5 outline-none resize-none border-none"
            />

            <button
              onClick={handleCreateNote}
              className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition"
            >
              Add Note
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.map((note, index) => {
                const colors = [
                  "bg-yellow-200",
                  "bg-pink-200",
                  "bg-green-200",
                  "bg-blue-200",
                  "bg-orange-200",
                ];

                return (
                  <div
                    key={note._id}
                    className={`${colors[index % colors.length]} p-5 rounded-3xl shadow-md min-h-[220px] flex flex-col justify-between transition hover:scale-[1.02]`}
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">
                        {note.title}
                      </h3>

                      <p className="text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    <div className="mt-6">
                      <input
                        type="email"
                        placeholder="Enter email to share"
                        value={shareEmails[note._id] || ""}
                        onChange={(e) =>
                          setShareEmails({
                            ...shareEmails,
                            [note._id]: e.target.value,
                          })
                        }
                        className="w-full mb-3 px-3 py-2 rounded-xl border-2 border-black bg-white text-black outline-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleShare(note._id)}
                          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
                        >
                          Share
                        </button>

                        <button
                          onClick={() => handleDelete(note._id)}
                          className="bg-white px-4 py-2 rounded-xl shadow text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-2xl font-semibold mb-5">
              Register
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <button
              onClick={handleRegister}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Register
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-2xl font-semibold mb-5">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
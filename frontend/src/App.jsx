import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

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

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Notes Service</h1>
            <p className="text-gray-600 mt-1">
              Multi-user notes backend frontend demo
            </p>
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
          <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">
            <h2 className="text-2xl font-semibold mb-5">
              Create Note
            </h2>

            <input
              type="text"
              placeholder="Note title"
              value={noteData.title}
              onChange={(e) =>
                setNoteData({
                  ...noteData,
                  title: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
            />

            <textarea
              rows="6"
              placeholder="Write your note here..."
              value={noteData.content}
              onChange={(e) =>
                setNoteData({
                  ...noteData,
                  content: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3 mb-4 outline-none resize-none"
            />

            <button
              onClick={handleCreateNote}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Create Note
            </button>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-2xl shadow-sm p-5"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {note.title}
                </h3>

                <p className="text-gray-700 mb-5">
                  {note.content}
                </p>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Delete
                </button>
              </div>
            ))}
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
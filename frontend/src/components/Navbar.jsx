import { Link, useNavigate } from "react-router-dom";

function Navbar({ setShowLogin }) {
  const navigate = useNavigate();

  // ✅ SAFE USER
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload(); // clean reset
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">

      {/* LOGO */}
      <h1
        className="text-xl font-bold text-purple-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        🎓 LearnCircle
      </h1>

      {/* LINKS */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link to="/dashboard" className="hover:text-purple-600">Dashboard</Link>
        <Link to="/create" className="hover:text-purple-600">Create</Link>
        <Link to="/profile" className="hover:text-purple-600">Profile</Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {user ? (
          <>
            <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>

            <span className="font-medium">{user.username}</span>

            <button
              onClick={logout}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        )}

      </div>

    </div>
  );
}

export default Navbar;
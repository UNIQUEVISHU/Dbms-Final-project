import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ setShowLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">

      {/* LOGO */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(user ? "/dashboard" : "/")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          ✨
        </div>
        <h1 className="text-xl font-bold text-purple-600">
          LearnCircle
        </h1>
      </div>

      {/* LINKS */}
      <div className="flex gap-6 text-gray-700 font-medium">

        <Link
          to="/dashboard"
          className={`hover:text-purple-600 transition ${
            location.pathname === "/dashboard"
              ? "text-purple-600 font-semibold"
              : ""
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/create"
          className={`hover:text-purple-600 transition ${
            location.pathname === "/create"
              ? "text-purple-600 font-semibold"
              : ""
          }`}
        >
          Create
        </Link>

        <Link
          to="/profile"
          className={`hover:text-purple-600 transition ${
            location.pathname === "/profile"
              ? "text-purple-600 font-semibold"
              : ""
          }`}
        >
          Profile
        </Link>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {user ? (
          <>
            {/* AVATAR */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>

            {/* NAME */}
            <span className="font-medium">{user.username}</span>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
        )}

      </div>

    </div>
  );
}

export default Navbar;
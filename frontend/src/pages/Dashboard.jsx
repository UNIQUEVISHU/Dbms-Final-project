import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [circles, setCircles] = useState([]);

  // 🔥 LOAD CIRCLES FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/circles")
      .then(res => res.json())
      .then(data => setCircles(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3ff]">

      <div className="absolute top-0 left-0 w-full h-[260px] bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 blur-2xl opacity-70"></div>

      <div className="relative px-12 pt-20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Your circles</h1>
            <p className="text-gray-500 mt-2">
              Jump back in or discover something new.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                alert("Login required");
                return;
              }
              navigate("/create");
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            + New circle
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {circles.length === 0 ? (
            <p className="text-gray-500">No circles yet</p>
          ) : (
            circles.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/circle/${c.id}`)}
                className="cursor-pointer bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-4">

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl text-white font-bold bg-purple-500">
                    {c.title?.charAt(0)}
                  </div>

                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    General
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold">{c.title}</h3>

                {/* DESC */}
                <p className="text-gray-500 text-sm mt-2">
                  {c.description}
                </p>

                {/* LINE */}
                <div className="h-[1px] bg-gray-200 my-4"></div>

                {/* FOOTER */}
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>👥 Members</span>
                  <span className="text-lg">↗</span>
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
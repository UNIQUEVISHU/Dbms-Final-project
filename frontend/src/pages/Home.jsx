import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LoginModal from "../components/LoginModal";

function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser(); // 🔥 Clerk user

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard"); // already logged in
    } else {
      setOpen(true); // open login modal
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] relative overflow-hidden">

      {/* TOP GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 blur-3xl opacity-70"></div>

      {/* CONTENT */}
      <div className="relative pt-36 px-6 text-center">

        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
          Learn together in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            small circles.
          </span>
        </h1>

        <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          LearnCircle is where curious people form tight-knit groups, 
          ship weekly tasks, and chat in real time — like Notion meets Discord, for learning.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex justify-center gap-4">

          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Get started →
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/70 backdrop-blur-md px-8 py-3 rounded-full shadow hover:bg-white transition"
          >
            Browse circles
          </button>

        </div>
      </div>

      {/* FEATURES */}
      <div className="relative grid md:grid-cols-3 gap-8 mt-28 px-12">

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500 text-white mb-4">
            👥
          </div>
          <h3 className="font-semibold text-lg">Circles</h3>
          <p className="text-gray-500 mt-2">
            Small groups learning out loud, together.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-500 text-white mb-4">
            ⚡
          </div>
          <h3 className="font-semibold text-lg">Tasks</h3>
          <p className="text-gray-500 mt-2">
            Lightweight goals to keep momentum every week.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-400 text-white mb-4">
            ✨
          </div>
          <h3 className="font-semibold text-lg">Live chat</h3>
          <p className="text-gray-500 mt-2">
            Discord-style threads built into every circle.
          </p>
        </div>

      </div>

      {/* LOGIN MODAL */}
      {open && <LoginModal close={() => setOpen(false)} />}
    </div>
  );
}

export default Home;
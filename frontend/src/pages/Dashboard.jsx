import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "React Mastery",
      desc: "Deep dives into hooks, performance, and architecture patterns.",
      tag: "Frontend",
      members: 248,
      color: "bg-purple-500",
      letter: "R",
    },
    {
      title: "Design Systems",
      desc: "Building scalable UI libraries with tokens and components.",
      tag: "Design",
      members: 132,
      color: "bg-pink-500",
      letter: "D",
    },
    {
      title: "AI Engineering",
      desc: "Practical LLM apps, RAG, and agent workflows.",
      tag: "AI/ML",
      members: 412,
      color: "bg-blue-500",
      letter: "A",
    },
    {
      title: "System Design",
      desc: "Distributed systems, caching strategies, and scalability.",
      tag: "Backend",
      members: 189,
      color: "bg-green-500",
      letter: "S",
    },
    {
      title: "Product Thinking",
      desc: "From discovery to launch — ship things people love.",
      tag: "Product",
      members: 96,
      color: "bg-orange-500",
      letter: "P",
    },
    {
      title: "Indie Hackers",
      desc: "Bootstrappers building profitable side projects.",
      tag: "Startup",
      members: 327,
      color: "bg-purple-400",
      letter: "I",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3ff]">

      {/* TOP GRADIENT */}
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
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            + New circle
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {cards.map((c, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-start mb-4">

                <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white font-bold ${c.color}`}>
                  {c.letter}
                </div>

                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {c.tag}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold">{c.title}</h3>

              {/* DESC */}
              <p className="text-gray-500 text-sm mt-2">
                {c.desc}
              </p>

              {/* LINE */}
              <div className="h-[1px] bg-gray-200 my-4"></div>

              {/* FOOTER */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>👥 {c.members} members</span>
                <span className="text-lg">↗</span>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
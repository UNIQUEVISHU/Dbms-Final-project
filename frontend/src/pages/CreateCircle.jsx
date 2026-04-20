import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function CreateCircle() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Frontend");

  const navigate = useNavigate();
  const { user } = useUser(); // 🔥 Clerk user

  const createCircle = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/circles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        category,
        clerk_id: user.id   // 🔥 CHANGE HERE
      })
    });

    if (res.ok) {
      navigate("/dashboard");
    } else {
      alert("Error creating circle");
    }
  };

  const categories = ["Frontend", "Backend", "Design", "AI/ML", "Product", "Startup"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex justify-center items-center">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[500px]">
        
        <h1 className="text-2xl font-bold mb-2">Start a circle</h1>
        <p className="text-gray-500 mb-6">
          Gather a small group around something you all want to learn.
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="e.g. React for beginners"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border p-3 rounded-lg"
            rows="4"
            placeholder="What will members learn?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full border ${
                  category === cat
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={createCircle}
            className="bg-purple-600 text-white px-5 py-2 rounded-xl"
          >
            Create circle
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreateCircle;
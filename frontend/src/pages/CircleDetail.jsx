import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CircleDetail() {
  const { id } = useParams();

  const [circle, setCircle] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // LOAD CIRCLE
  useEffect(() => {
    fetch(`http://localhost:5000/api/circles/${id}`)
      .then(res => res.json())
      .then(data => setCircle(data));
  }, [id]);

  // LOAD TASKS
  const loadTasks = () => {
    fetch(`http://localhost:5000/api/circles/${id}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    loadTasks();
  }, [id]);

  // LOAD MESSAGES
  const loadMessages = () => {
    fetch(`http://localhost:5000/api/circles/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  useEffect(() => {
    loadMessages();
  }, [id]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!user?.id) return alert("Login required");
    if (!text.trim()) return;

    await fetch(`http://localhost:5000/api/circles/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        user_id: user.id
      })
    });

    setText("");
    loadMessages();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {circle?.title || "Loading..."}
        </h1>
        <p className="text-gray-600">{circle?.description}</p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* TASKS */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks</p>
          ) : (
            tasks.map(t => (
              <div
                key={t.id}
                className="border p-3 rounded-lg mb-3 hover:shadow"
              >
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-500">
                  {t.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* CHAT */}
        <div className="bg-white p-5 rounded-2xl shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-[300px]">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages</p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[70%] ${
                    m.user_id === user?.id
                      ? "bg-purple-500 text-white ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              ))
            )}
          </div>

          {/* INPUT */}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border p-2 rounded-lg"
            />

            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CircleDetail;
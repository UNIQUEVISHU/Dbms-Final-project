import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginModal({ close }) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // ✅ FAKE LOGIN
  const handleLogin = () => {
    const dummyUser = {
      id: 1,
      username: username || "demoUser",
      email: "demo@gmail.com"
    };

    localStorage.setItem("user", JSON.stringify(dummyUser));
    navigate("/dashboard");
    close();
  };

  // ✅ FAKE REGISTER
  const handleRegister = () => {
    const dummyUser = {
      id: 1,
      username: username,
      email: email
    };

    localStorage.setItem("user", JSON.stringify(dummyUser));
    navigate("/dashboard");
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[360px] overflow-hidden shadow-xl">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 flex justify-between">
          <h2>{isLogin ? "Sign in" : "Register"}</h2>
          <button onClick={close}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          <input
            placeholder="Username"
            className="w-full border p-2 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!isLogin && (
            <input
              placeholder="Email"
              className="w-full border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={isLogin ? handleLogin : handleRegister}
            className="w-full bg-purple-600 text-white py-2 rounded-lg"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-center text-sm">
            {isLogin ? "New user?" : "Already have account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 cursor-pointer ml-1"
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginModal;
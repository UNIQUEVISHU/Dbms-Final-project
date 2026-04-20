import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CircleDetail from "./pages/CircleDetail";
import Create from "./pages/CreateCircle";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>

      {/* Navbar */}
      <Navbar setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/circle/:id" element={<CircleDetail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal close={() => setShowLogin(false)} />
      )}

    </BrowserRouter>
  );
}

export default App;
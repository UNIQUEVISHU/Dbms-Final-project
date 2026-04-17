import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser) return;

    fetch(`http://localhost:5000/api/users/${localUser.id}/profile`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8 flex justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">

        {/* AVATAR */}
        <div className="w-20 h-20 bg-purple-500 text-white flex items-center justify-center rounded-full text-2xl mx-auto mb-4">
          {user.username[0]}
        </div>

        {/* NAME */}
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-500 mb-4">{user.email}</p>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-lg font-bold">{user.points}</p>
            <p className="text-sm text-gray-500">Points</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-lg font-bold">{user.reputation_level}</p>
            <p className="text-sm text-gray-500">Level</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
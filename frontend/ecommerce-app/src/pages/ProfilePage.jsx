import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in first.");
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          console.log(userData)
          setUser(userData);
        } else {
          const error = await response.json();
          alert(error.error || "Failed to fetch user details.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        alert("An error occurred while fetching user details.");
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      alert("Please enter a valid username.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:8000/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newUsername }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setUser((prevUser) => ({ ...prevUser, username: newUsername }));
        setNewUsername("");
      } else {
        alert(result.error || "Failed to update username.");
      }
    } catch (err) {
      console.error("Error updating username:", err);
      alert("An error occurred while updating your username.");
    }
  };

    const handleLogout = () => {
      localStorage.removeItem("userId");
      alert("You have been logged out.");
      navigate("/");
    };

    if (!user) {
      return <div>Loading user details...</div>;
    }

  return (
    <div className="profull">
    <div className="profile-container">
      <h1 className="prof">Profile</h1>
     

      <div className="user-info">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Account Created At:</strong> {new Date(user.created_at).toLocaleString()}
        </p>
      </div>

      <div className="update-username">
        <h3>Update Username</h3>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Enter new username"
          className="inputun"
        />
        <button onClick={handleUpdateUsername} className="update-button">
          Update
        </button>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
    </div>
  );
};

export default ProfilePage;

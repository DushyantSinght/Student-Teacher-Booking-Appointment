import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./SDashboard.css";
import { auth, db, logout } from "../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setName(data.name);
      } else {
        console.warn("No user document found for this UID.");
        setName("Unknown User");
      }
    } catch (err) {
      console.error("Error fetching user name:", err);
      alert("An error occurred while fetching user data.");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/slogin");
    fetchUserName();
  }, [user, loading, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <p>Logged in as:</p>
        <div><strong>Name:</strong> {name ? name : "Loading..."}</div>
        <div><strong>Email:</strong> {user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

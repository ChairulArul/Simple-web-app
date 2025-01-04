import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); //
  };

  return (
    <header>
      <div className="inner-header">
        <h1 className="logo">Pertemuan15</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

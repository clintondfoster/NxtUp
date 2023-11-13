import { useState } from "react";
import { useLogoutMutation } from "../../reducers/auth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.scss";
import logo from "../../assets/upnxtlogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [visible, setVisible] = useState(false);

  function toggleMenu() {
    setVisible((toggle) => !toggle);
  }

  function handleHome() {
    navigate("/home");
  }

  function handleAccount() {
    navigate("/account-settings");
  }

  function handleHowTo() {
    navigate("/how-to-play");
  }

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="nav-container">
      <div className="navbar">
        <div className="nav-home" onClick={handleHome}>
          <img className="nav-logo" src={logo} />
        </div>
        <div className="nav-menu" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </div>
      </div>
      <div className={`nav-links ${visible ? "active" : ""}`}>
        <div className="nav-btn" onClick={handleHome}>
          Home
        </div>
        <div className="nav-btn" onClick={handleAccount}>
          Account
        </div>
        <div className="nav-btn" onClick={handleHowTo}>
          How to Play
        </div>
        <div className="nav-btn" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}

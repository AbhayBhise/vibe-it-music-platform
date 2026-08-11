import React, { useState } from "react";
import { FiSearch, FiBell, FiSettings, FiLogOut, FiUser, FiLogIn } from "react-icons/fi";
import { CiUser, CiLogin } from "react-icons/ci";
import logo from "../../assets/wsa-logo.jpg";
import "../../css/layout/TopNav.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

const TopNav = ({ user, onSearch, activeTab = "music", onOpenEditProfile }) => {
  const tabs = ["MUSIC", "PODCAST", "LIVE"];
  const dispatch = useDispatch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
  };

  const handleLogin = () => {
    dispatch(openAuthModal("login"));
  };

  const handleSignup = () => {
    dispatch(openAuthModal("signup"));
  };

  return (
    <nav className="topnav-root">
      {/* Left: Logo */}
      <div className="topnav-left">
        <img src={logo} alt="Groovy" className="topnav-logo" />
        <h1 className="topnav-brand">Groovy</h1>
      </div>

      {/* Center-Left: Tabs */}
      <div className="topnav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`topnav-tab ${activeTab.toLowerCase() === tab.toLowerCase() ? "active" : ""
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Center: Search */}
      <div className="topnav-search">
        <FiSearch className="topnav-search-icon" />
        <input
          type="text"
          placeholder="Type here to search"
          className="topnav-search-input"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Right: User Actions */}
      <div className="topnav-right">
        {user ? (
          <>
            <button className="topnav-icon-btn">
              <FiBell size={20} />
            </button>
            <button className="topnav-icon-btn">
              <FiSettings size={20} />
            </button>

            <div className="topnav-user-container">
              <div
                className="topnav-user"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <CiUser size={24} />
                <span className="topnav-username">{user.name}</span>
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="topnav-profile-menu">
                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      onOpenEditProfile && onOpenEditProfile();
                      setShowProfileMenu(false);
                    }}
                  >
                    <FiUser size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="profile-menu-item logout" onClick={handleLogout}>
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="topnav-auth-actions">
            <button className="topnav-auth-btn login" onClick={handleLogin}>
              Log In
            </button>
            <button className="topnav-auth-btn signup" onClick={handleSignup}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNav;

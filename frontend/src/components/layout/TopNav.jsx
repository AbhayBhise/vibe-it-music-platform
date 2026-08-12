import React, { useState } from "react";
import { FiSearch, FiBell, FiSettings, FiLogOut, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import logo from "../../assets/wsa-logo.jpg";
import "../../css/layout/TopNav.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

const TopNav = ({ 
  user, onSearch, activeTab = "music", onOpenEditProfile,
  handleGoBack, handleGoForward, canGoBack, canGoForward 
}) => {
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
      {/* Left: Logo & Navigation */}
      <div className="topnav-left">
        <img src={logo} alt="Vibe It" className="topnav-logo" />
        <h1 className="topnav-brand">Vibe It</h1>
        
        <div className="topnav-nav-arrows" style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
          <button 
            className="topnav-icon-btn" 
            onClick={handleGoBack} 
            disabled={!canGoBack}
            style={{ opacity: canGoBack ? 1 : 0.5, cursor: canGoBack ? 'pointer' : 'not-allowed' }}
          >
            <FiChevronLeft size={24} />
          </button>
          <button 
            className="topnav-icon-btn" 
            onClick={handleGoForward} 
            disabled={!canGoForward}
            style={{ opacity: canGoForward ? 1 : 0.5, cursor: canGoForward ? 'pointer' : 'not-allowed' }}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
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

import React from "react";
import { FiSearch, FiBell, FiSettings } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import logo from "../../assets/wsa-logo.jpg";
import "../../css/layout/TopNav.css";

const TopNav = ({ user, onSearch, activeTab = "music" }) => {
  const tabs = ["MUSIC", "PODCAST", "LIVE"];

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
            className={`topnav-tab ${
              activeTab.toLowerCase() === tab.toLowerCase() ? "active" : ""
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
        <button className="topnav-icon-btn">
          <FiBell size={20} />
        </button>
        <button className="topnav-icon-btn">
          <FiSettings size={20} />
        </button>
        <div className="topnav-user">
          <CiUser size={24} />
          <span className="topnav-username">{user?.name || "Dave Cooper"}</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

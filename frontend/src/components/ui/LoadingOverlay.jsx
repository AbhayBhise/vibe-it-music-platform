import React from "react";
import "../../css/ui/LoadingOverlay.css";
import logo from "../../assets/wsa-logo.jpg";

const LoadingOverlay = ({ isVisible }) => {
  return (
    <div
      className={`loading-overlay ${isVisible ? "" : "loading-overlay--hidden"}`}
      aria-hidden={!isVisible}
    >
      <div className="loading-overlay-card">
        <div className="loading-logo-wrap">
          <img src={logo} alt="Loading" className="loading-logo" />
        </div>
        <div className="loading-text">Discovering your vibe…</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

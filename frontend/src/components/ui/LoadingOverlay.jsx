import React from "react";
import "../../css/ui/LoadingOverlay.css";

const LoadingOverlay = ({ isVisible }) => {
  return (
    <div
      className={`loading-overlay ${isVisible ? "" : "loading-overlay--hidden"}`}
      aria-hidden={!isVisible}
    >
      <div className="loading-overlay-card">
        <div className="loading-bars-wrap">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
        <div className="loading-text">Discovering your vibe…</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

import React from "react";
import { FaPlay } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import "../../css/home/HeroSection.css";

const HeroSection = ({ featuredSong, onPlay }) => {
    if (!featuredSong) {
        return null;
    }

    return (
        <div
            className="hero-section"
            style={{
                backgroundImage: `url(${featuredSong.image})`,
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-text">
                    <span className="hero-label">Trending New Hits</span>
                    <h1 className="hero-title">{featuredSong.name}</h1>
                    <p className="hero-artist">
                        {featuredSong.artist_name} • {featuredSong.releasedate || "2024"}
                    </p>
                </div>

                <div className="hero-actions">
                    <button className="hero-btn-primary" onClick={onPlay}>
                        <FaPlay size={18} />
                        Listen Now
                    </button>
                    <button className="hero-btn-secondary">
                        <FiHeart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

import React, { useState } from "react";
import { FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import "../../css/home/HeroSection.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateFavourites } from "../../redux/slices/authSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

const HeroSection = ({ featuredSong, onPlay }) => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [likeLoading, setLikeLoading] = useState(false);

    if (!featuredSong) {
        return null;
    }

    const currentSongId = featuredSong.id;
    const isLiked = Boolean(
        currentSongId &&
        user?.favourites?.some((fav) => String(fav.id) === String(currentSongId))
    );

    const handleLike = async () => {
        if (!isAuthenticated) {
            dispatch(openAuthModal("login"));
            return;
        }

        if (likeLoading) return;

        try {
            setLikeLoading(true);
            const songData = {
                id: featuredSong.id,
                name: featuredSong.name,
                artist_name: featuredSong.artist_name,
                image: featuredSong.image,
                duration: featuredSong.duration,
                audio: featuredSong.audio,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
                { song: songData },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(updateFavourites(res.data.favourites));
        } catch (error) {
            console.error("Like failed:", error.response?.data || error.message);
        } finally {
            setLikeLoading(false);
        }
    };

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
                    <button
                        className={`hero-btn-secondary ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        {isLiked ? (
                            <FaHeart size={20} color="#EC4899" />
                        ) : (
                            <FiHeart size={20} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

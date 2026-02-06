import React from "react";
import { FaPlay, FaHeart, FaEllipsisH } from "react-icons/fa";
import { formatTime } from "../utils/helper";
import "../../css/home/TopCharts.css";

const TopCharts = ({ songs = [], onSelectSong, currentIndex }) => {
    return (
        <div className="top-charts">
            <div className="top-charts-header">
                <h2 className="top-charts-title">Top Charts</h2>
                <button className="top-charts-see-all">See all</button>
            </div>

            <div className="top-charts-list">
                {songs.slice(0, 4).map((song, index) => (
                    <div
                        key={song.id}
                        className={`chart-item ${currentIndex === index ? "active" : ""}`}
                        onClick={() => onSelectSong(index)}
                    >
                        {/* Rank */}
                        <span className="chart-rank">{(index + 1).toString().padStart(2, "0")}</span>

                        {/* Artwork */}
                        <div className="chart-artwork">
                            <img src={song.image} alt={song.name} />
                            <div className="chart-play-overlay">
                                <FaPlay size={12} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="chart-info">
                            <h4 className="chart-song-name">{song.name}</h4>
                            <p className="chart-artist-name">{song.artist_name}</p>
                        </div>

                        {/* Duration */}
                        <span className="chart-duration">{formatTime(song.duration)}</span>

                        {/* Actions */}
                        <div className="chart-actions">
                            <button className="chart-action-btn">
                                <FaHeart size={16} />
                            </button>
                            <button className="chart-action-btn">
                                <FaEllipsisH size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCharts;

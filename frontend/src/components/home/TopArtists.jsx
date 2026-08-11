import React from "react";
import "../../css/home/TopArtists.css";

const TopArtists = ({ artists = [], onSelectArtist }) => {
    if (!artists || artists.length === 0) {
        return null; // Or a loading skeleton could go here
    }

    const displayArtists = artists;

    return (
        <div className="top-artists">
            {/* Header removed from here to allow MainArea config */}
            <div className="top-artists-grid">
                {displayArtists.slice(0, 6).map((artist, index) => (
                    <div
                        key={artist.id || index}
                        className="artist-card"
                        onClick={() => onSelectArtist && onSelectArtist(artist)}
                    >
                        <div className="artist-image">
                            {artist.image ? (
                                <img src={artist.image} alt={artist.name} />
                            ) : (
                                <div className="artist-placeholder">
                                    {artist.name?.charAt(0) || "A"}
                                </div>
                            )}
                        </div>
                        <div className="artist-info">
                            <h3 className="artist-name">{artist.name || "Artist"}</h3>
                            <p className="artist-followers">{artist.followers || "1M Fans"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopArtists;

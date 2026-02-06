import React from "react";
import "../../css/home/TopArtists.css";

const TopArtists = ({ artists = [], onSelectArtist }) => {
    // Default artists if none provided
    const defaultArtists = [
        { id: 1, name: "Travis Scott", followers: "8.9M Fans", image: null },
        { id: 2, name: "Billie Eilish", followers: "10M Fans", image: null },
        { id: 3, name: "The Kid LAROI", followers: "2.6M Fans", image: null },
        { id: 4, name: "Kanye West", followers: "5.8M Fans", image: null },
        { id: 5, name: "Nicki Minaj", followers: "5.6M Fans", image: null },
        { id: 6, name: "Bad Bunny", followers: "4.2M Fans", image: null },
    ];

    const displayArtists = artists.length > 0 ? artists : defaultArtists;

    return (
        <div className="top-artists">
            <div className="top-artists-header">
                <h2 className="top-artists-title">Top Artists</h2>
                <button className="top-artists-see-all">See all</button>
            </div>

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

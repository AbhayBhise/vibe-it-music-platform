import React from "react";
import "../../css/home/GenreGrid.css";
import { MdLibraryMusic, MdAlbum, MdSurfing, MdPiano, MdMic, MdGraphicEq, MdMusicNote } from "react-icons/md";
import { FaGuitar } from "react-icons/fa"; // Use FA for guitar if MD missing or just stick to MD

const GenreGrid = ({ genres, onSelectGenre }) => {
    // Content updated to "Playlists"
    const defaultPlaylists = [
        { id: "chill", name: "Chill", icon: <MdSurfing size={20} /> },
        { id: "workout", name: "Workout", icon: <MdGraphicEq size={20} /> },
        { id: "rock", name: "Rock", icon: <FaGuitar size={18} /> },
        { id: "refreshing", name: "Refreshing", icon: <MdLibraryMusic size={20} /> },
        { id: "focus", name: "Focus", icon: <MdAlbum size={20} /> },
        { id: "party", name: "Party", icon: <MdMic size={20} /> },
    ];

    // Ignore passed 'genres' if we want to force this layout, or merge? 
    // User asked to "replace the genere block with the playlist block".
    // So I will force these defaults if 'genres' is empty or just use them.
    // I will use them as default.

    const displayItems = defaultPlaylists;

    return (
        <div className="genre-grid">
            <div className="genre-grid-container">
                {displayItems.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="genre-bubble"
                        onClick={() => onSelectGenre && onSelectGenre(item.name)}
                    >
                        <div className="genre-icon-bubble">
                            {item.icon}
                        </div>
                        <span className="genre-name">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreGrid;

import React from "react";
import "../../css/home/GenreGrid.css";
import { MdLibraryMusic, MdAlbum, MdSurfing, MdPiano, MdMic, MdGraphicEq, MdMusicNote } from "react-icons/md";
import { FaGuitar } from "react-icons/fa"; // Use FA for guitar if MD missing or just stick to MD

const GenreGrid = ({ genres, onSelectGenre }) => {
    // Content updated to "Playlists"
    const realPlaylists = [
        { id: "pop", name: "Pop", icon: <MdSurfing size={20} /> },
        { id: "electronic", name: "Electronic", icon: <MdGraphicEq size={20} /> },
        { id: "rock", name: "Rock", icon: <FaGuitar size={18} /> },
        { id: "jazz", name: "Jazz", icon: <MdLibraryMusic size={20} /> },
        { id: "hiphop", name: "Hip Hop", icon: <MdAlbum size={20} /> },
        { id: "classical", name: "Classical", icon: <MdMic size={20} /> },
    ];

    const displayItems = realPlaylists;

    return (
        <div className="genre-grid">
            <div className="genre-grid-container">
                {displayItems.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="genre-bubble"
                        onClick={() => onSelectGenre && onSelectGenre(item.id)}
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

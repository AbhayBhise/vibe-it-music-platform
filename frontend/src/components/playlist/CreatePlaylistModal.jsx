import React, { useState } from "react";
import "../../css/layout/CreatePlaylistModal.css";

const CreatePlaylistModal = ({ onClose, onCreate }) => {
    const [playlistName, setPlaylistName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (playlistName.trim()) {
            onCreate(playlistName);
            onClose();
        }
    };

    return (
        <div className="modal-content-wrapper">
            <h2 className="modal-title">Create New Playlist</h2>
            <form onSubmit={handleSubmit} className="create-playlist-form">
                <input
                    type="text"
                    placeholder="Playlist Name"
                    className="playlist-input"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    autoFocus
                />
                <div className="modal-actions">
                    <button type="button" className="modal-btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="modal-btn-create" disabled={!playlistName.trim()}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePlaylistModal;

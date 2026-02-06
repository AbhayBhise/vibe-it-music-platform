import React from "react";
import "../../css/home/GenreGrid.css";

const GenreGrid = ({ genres = [], onSelectGenre }) => {
    // Default genres with colors
    const defaultGenres = [
        { id: 1, name: "Dance Beat", color: "#6B8EFF" },
        { id: 2, name: "Electro Pop", color: "#C2A887" },
        { id: 3, name: "Alternative Indie", color: "#B57B63" },
        { id: 4, name: "Classical Crossover", color: "#FF6B9D" },
        { id: 5, name: "Hip Hop", color: "#4A5568" },
        { id: 6, name: "Pop", color: "#5B6EDD" },
    ];

    const displayGenres = genres.length > 0 ? genres : defaultGenres;

    return (
        <div className="genre-grid">
            <div className="genre-grid-header">
                <h2 className="genre-grid-title">Genres</h2>
                <button className="genre-grid-see-all">See all</button>
            </div>

            <div className="genre-grid-container">
                {displayGenres.map((genre) => (
                    <div
                        key={genre.id}
                        className="genre-card"
                        style={{ backgroundColor: genre.color || "#333" }}
                        onClick={() => onSelectGenre && onSelectGenre(genre)}
                    >
                        <span className="genre-name">{genre.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreGrid;

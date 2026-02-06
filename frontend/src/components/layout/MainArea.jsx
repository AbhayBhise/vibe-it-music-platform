import React from "react";

import Auth from "../auth/Auth";
import SearchBar from "../search/SearchBar";
import SongGrid from "../songs/SongGrid";
import HeroSection from "../home/HeroSection";
import TopArtists from "../home/TopArtists";
import GenreGrid from "../home/GenreGrid";
import TopCharts from "../home/TopCharts";

import "../../css/mainArea/MainArea.css";
import { useSelector } from "react-redux";

const MainArea = ({ view,
  currentIndex,
  onSelectSong,
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSongs,
  isSongsLoading, }) => {
  const auth = useSelector((state) => state.auth);

  // Get featured song (first song or random)
  const featuredSong = songsToDisplay && songsToDisplay.length > 0
    ? songsToDisplay[0]
    : null;

  const handlePlayFeatured = () => {
    if (featuredSong) {
      onSelectSong(0);
    }
  };

  return (
    <div className={`mainarea-root ${isSongsLoading ? "mainarea-loading" : "mainarea-loaded"}`}>
      {/* Top Bar with Auth */}
      <div className="mainarea-top">
        <Auth />
      </div>

      {/* Scrollable Content */}
      <div className="mainarea-scroll">
        {view === "home" && (
          <>
            {/* Hero Section */}
            <HeroSection
              featuredSong={featuredSong}
              onPlay={handlePlayFeatured}
            />

            {/* Top Artists */}
            <TopArtists
              artists={[]}
              onSelectArtist={() => { }}
            />

            {/* Genres and Top Charts Side by Side */}
            <div className="mainarea-split">
              <GenreGrid
                genres={[]}
                onSelectGenre={onSelectTag}
              />

              <TopCharts
                songs={songsToDisplay}
                onSelectSong={onSelectSong}
                currentIndex={currentIndex}
              />
            </div>
          </>
        )}

        {view === "search" && (
          <>
            <SearchBar setSearchSongs={setSearchSongs} />
            <div className="search-results-title">Search Results</div>
            <TopCharts
              songs={songsToDisplay}
              onSelectSong={onSelectSong}
              currentIndex={currentIndex}
            />
          </>
        )}

        {view === "favourite" && (
          <SongGrid songs={auth.user?.favourites || []} onSelectFavourite={onSelectFavourite} />
        )}
      </div>
    </div>
  );
};

export default MainArea;

import React, { useState } from "react";

import Auth from "../auth/Auth";
import SearchBar from "../search/SearchBar";
import SongGrid from "../songs/SongGrid";
import HeroSection from "../home/HeroSection";
import TopArtists from "../home/TopArtists";
import GenreGrid from "../home/GenreGrid";
import TopCharts from "../home/TopCharts";
import { FaArrowLeft } from "react-icons/fa";

import "../../css/mainArea/MainArea.css";
import { useSelector } from "react-redux";

const MainArea = ({
  view,
  currentIndex,
  currentSong,
  isPlaying,
  onSelectSong,
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSongs,
  isSongsLoading,
  onBackToHome
}) => {
  const auth = useSelector((state) => state.auth);
  const [internalView, setInternalView] = useState("default");

  const featuredSong = songsToDisplay && songsToDisplay.length > 0 ? songsToDisplay[0] : null;

  const handlePlayFeatured = () => {
    if (featuredSong) onSelectSong(0);
  };

  const handleBack = () => setInternalView("default");

  return (
    <div className={`mainarea-root ${isSongsLoading ? "mainarea-loading" : "mainarea-loaded"}`}>
      <div className="mainarea-top">
        <Auth />
      </div>

      <div className="mainarea-scroll">
        {view === "home" && internalView === "default" && (
          <>
            <HeroSection featuredSong={featuredSong} onPlay={handlePlayFeatured} />

            <div className="section-header">
              <h2 className="section-title">Top Artists</h2>
              <button className="section-see-all" onClick={() => setInternalView("see_all_artists")}>See all</button>
            </div>
            <TopArtists artists={[]} onSelectArtist={() => { }} />

            <div className="mainarea-split">
              <div className="split-section">
                <div className="section-header">
                  <h2 className="section-title">Playlists</h2>
                  <button className="section-see-all" onClick={() => setInternalView("see_all_genres")}>See all</button>
                </div>
                <GenreGrid genres={[]} onSelectGenre={onSelectTag} />
              </div>

              <div className="split-section">
                <div className="section-header">
                  <h2 className="section-title">Top Charts</h2>
                  <button className="section-see-all" onClick={() => setInternalView("see_all_charts")}>See all</button>
                </div>
                <TopCharts
                  songs={songsToDisplay.slice(0, 4)}
                  onSelectSong={onSelectSong}
                  currentIndex={currentIndex}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          </>
        )}

        {/* Expanded Views */}
        {view === "home" && internalView === "see_all_charts" && (
          <div className="expanded-view">
            <div className="expanded-header">
              <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
              <h2>Top Charts</h2>
            </div>
            <TopCharts
              songs={songsToDisplay}
              onSelectSong={onSelectSong}
              currentIndex={currentIndex}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
          </div>
        )}

        {view === "home" && internalView === "see_all_artists" && (
          <div className="expanded-view">
            <div className="expanded-header">
              <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
              <h2>All Artists</h2>
            </div>
            <TopArtists artists={[]} onSelectArtist={() => { }} />
          </div>
        )}

        {view === "home" && internalView === "see_all_genres" && (
          <div className="expanded-view">
            <div className="expanded-header">
              <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Back</button>
              <h2>All Playlists</h2>
            </div>
            <GenreGrid genres={[]} onSelectGenre={onSelectTag} />
          </div>
        )}

        {view === "search" && (
          <>
            <SearchBar setSearchSongs={setSearchSongs} />
            <div className="search-results-title">Search Results</div>
            <TopCharts
              songs={songsToDisplay}
              onSelectSong={onSelectSong}
              currentIndex={currentIndex}
              currentSong={currentSong}
              isPlaying={isPlaying}
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

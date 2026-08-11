import React, { useState, useEffect } from "react";

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
  activeMenu,
  currentIndex,
  currentSong,
  isPlaying,
  onSelectSong,
  onSelectArtist,
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSongs,
  isSongsLoading,
  onBackToHome
}) => {
  const auth = useSelector((state) => state.auth);
  const [internalView, setInternalView] = useState("default");

  useEffect(() => {
    if (activeMenu === "myalbums") setInternalView("see_all_genres");
    else if (activeMenu === "myartists") setInternalView("see_all_artists");
    else if (activeMenu === "recent" || activeMenu?.startsWith("artist-") || activeMenu?.startsWith("playlist-")) setInternalView("see_all_charts");
    else setInternalView("default");
  }, [activeMenu]);

  const featuredSong = songsToDisplay && songsToDisplay.length > 0 ? songsToDisplay[0] : null;

  // Compute unique artists from songsToDisplay
  const uniqueArtistsMap = new Map();
  (songsToDisplay || []).forEach(song => {
    if (song.artist_name && !uniqueArtistsMap.has(song.artist_name)) {
      uniqueArtistsMap.set(song.artist_name, {
        id: song.artist_id || song.artist_name,
        name: song.artist_name,
        image: song.image, // Use the song's image as a fallback for the artist image
        followers: "1M Fans" // Jamendo track API doesn't return followers, use a placeholder
      });
    }
  });
  const dynamicArtists = Array.from(uniqueArtistsMap.values());

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
            <TopArtists artists={dynamicArtists} onSelectArtist={onSelectArtist} />

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
            <TopArtists artists={dynamicArtists} onSelectArtist={onSelectArtist} />
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

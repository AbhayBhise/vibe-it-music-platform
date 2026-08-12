import React, { useState, useEffect } from "react";

import Auth from "../auth/Auth";
import SongGrid from "../songs/SongGrid";
import HeroSection from "../home/HeroSection";
import TopArtists from "../home/TopArtists";
import GenreGrid from "../home/GenreGrid";
import TopCharts from "../home/TopCharts";
import { FaArrowLeft, FaHeart } from "react-icons/fa";

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
  searchQuery,
  isSongsLoading,
  onBackToHome,
  internalView,
  onNavigate
}) => {
  const auth = useSelector((state) => state.auth);



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
              <button className="section-see-all" onClick={() => onNavigate({ internalView: "see_all_artists" })}>See all</button>
            </div>
            <TopArtists artists={dynamicArtists} onSelectArtist={onSelectArtist} />

            <div className="mainarea-split">
              <div className="split-section">
                <div className="section-header">
                  <h2 className="section-title">Playlists</h2>
                  <button className="section-see-all" onClick={() => onNavigate({ internalView: "see_all_genres" })}>See all</button>
                </div>
                <GenreGrid genres={[]} onSelectGenre={onSelectTag} />
              </div>

              <div className="split-section">
                <div className="section-header">
                  <h2 className="section-title">Top Charts</h2>
                  <button className="section-see-all" onClick={() => onNavigate({ internalView: "see_all_charts" })}>See all</button>
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
              <h2>Top Charts</h2>
            </div>
            {songsToDisplay && songsToDisplay.length > 0 ? (
              <TopCharts
                songs={songsToDisplay}
                onSelectSong={onSelectSong}
                currentIndex={currentIndex}
                currentSong={currentSong}
                isPlaying={isPlaying}
              />
            ) : (
              <div className="empty-state">
                <p>No songs found.</p>
              </div>
            )}
          </div>
        )}

        {view === "home" && internalView === "see_all_artists" && (
          <div className="expanded-view">
            <div className="expanded-header">
              <h2>All Artists</h2>
            </div>
            {dynamicArtists && dynamicArtists.length > 0 ? (
              <TopArtists artists={dynamicArtists} onSelectArtist={onSelectArtist} />
            ) : (
              <div className="empty-state">
                <p>No artists found.</p>
              </div>
            )}
          </div>
        )}

        {view === "home" && internalView === "see_all_genres" && (
          <div className="expanded-view">
            <div className="expanded-header">
              <h2>All Playlists</h2>
            </div>
            <GenreGrid genres={[]} onSelectGenre={onSelectTag} />
          </div>
        )}

        {view === "search" && (
          <>
            <div className="search-results-title">
              Search Results for "{searchQuery}"
            </div>
            {songsToDisplay && songsToDisplay.length > 0 ? (
              <TopCharts
                songs={songsToDisplay}
                onSelectSong={onSelectSong}
                currentIndex={currentIndex}
                currentSong={currentSong}
                isPlaying={isPlaying}
              />
            ) : (
              <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                <p>No songs found for "{searchQuery}". Try a different search!</p>
              </div>
            )}
          </>
        )}

        {view === "favourite" && (
          <>
            <div className="expanded-header">
              <h2>Your Favourites</h2>
            </div>
            {auth.user?.favourites && auth.user.favourites.length > 0 ? (
              <SongGrid songs={auth.user.favourites} onSelectFavourite={onSelectFavourite} />
            ) : (
              <div className="empty-state" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#9ca3af' }}>
                <FaHeart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No favourite songs yet!</h3>
                <p>Click the heart icon on any playing song to add it to your favourites.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainArea;

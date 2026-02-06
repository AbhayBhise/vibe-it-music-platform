import React, { useState, useEffect } from "react";

import TopNav from "../components/layout/TopNav";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import RightPlayerPanel from "../components/layout/RightPlayerPanel";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import "../css/pages/HomePage.css";
import { useSelector } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/useAudioPlayer";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [isSongsLoading, setIsSongsLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const { authModalOpen } = useSelector((state) => state.ui);

  const normalizedView = (view || "").toLowerCase();
  const songsToDisplay = normalizedView === "search" ? searchSongs : songs;

  const { audioRef, currentIndex, currentSong, currentTime, isPlaying, loopEnabled, duration, isMuted, shuffleEnabled, playbackSpeed, volume, playSongAtIndex, handleTogglePlay, handleNext, handlePrev, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleToggleMute, handleToggleLoop, handleToggleShuffle, handleChangeSpeed, handleSeek, handleChangeVolume } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong, isPlaying, currentTime, duration, isMuted, loopEnabled, shuffleEnabled, playbackSpeed, volume
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume
  };

  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        setIsSongsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`,
        );
        setSongs(res.data.results || [])
      } catch (error) {
        console.error("Error while fetching the songs", error);
        setSongs([]);
      } finally {
        setIsSongsLoading(false);
      }
    };
    fetchInitialSongs();
  }, []);

  const loadPlaylist = async (tag) => {
    if (!tag) {
      console.warn("No tag is provided!")
      return;
    }
    try {
      setIsSongsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`
      );
      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Failed to load playlist. ", error);
      setSongs([]);
    } finally {
      setIsSongsLoading(false);
    }
  };

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  }

  const handlePlayFavourite = (songs) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;
    const index = auth.user.favourites.findIndex((fav) => fav.id === songs.id);
    setSongs(auth.user.favourites);
    setView("home");
    setTimeout(() => {
      if (index != -1) {
        playSongAtIndex(index)
      }
    }, 0);
  };

  const handleSearch = (query) => {
    if (query && query.trim()) {
      setView("search");
    }
  };

  return (
    <>
      {isSongsLoading && !authModalOpen && <LoadingOverlay isVisible={isSongsLoading} />}
      <div className="homepage-root">
        <audio ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}>
          {currentSong &&
            <source
              src={currentSong.audio}
              type="audio/mpeg" />}
        </audio>

        {/* Top Navigation */}
        <TopNav
          user={auth.user}
          onSearch={handleSearch}
          activeTab="music"
        />

        <div className="homepage-main-wrapper">
          {/* Left Sidebar */}
          <div className="homepage-sidebar">
            <SideMenu
              setView={setView}
              view={normalizedView}
              onOpenEditProfile={() => setOpenEditProfile(true)}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
          </div>

          {/* Main Content */}
          <div className="homepage-content">
            <MainArea
              view={normalizedView}
              currentIndex={currentIndex}
              onSelectSong={handleSelectSong}
              onSelectFavourite={handlePlayFavourite}
              onSelectTag={loadPlaylist}
              songsToDisplay={songsToDisplay}
              setSearchSongs={setSearchSongs}
              isSongsLoading={isSongsLoading}
            />
          </div>

          {/* Right Player Panel */}
          <RightPlayerPanel
            playerState={playerState}
            playerControls={playerControls}
            playerFeatures={playerFeatures}
          />
        </div>

        {openEditProfile && (
          <Modal onClose={() => setOpenEditProfile(false)}>
            <EditProfile onClose={() => setOpenEditProfile(false)} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Homepage;

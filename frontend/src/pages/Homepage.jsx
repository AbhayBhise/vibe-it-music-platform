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
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import toast from 'react-hot-toast';

const Homepage = () => {
  const [history, setHistory] = useState([
    { view: "home", activeMenu: "home", internalView: "default" }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentNavState = history[historyIndex] || { view: "home", activeMenu: "home", internalView: "default" };
  const { view, activeMenu, internalView } = currentNavState;

  const [songsCache, setSongsCache] = useState({});

  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false);
  const [isSongsLoading, setIsSongsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useSelector((state) => state.auth);
  const { authModalOpen } = useSelector((state) => state.ui);

  const navigate = (updates) => {
    const nextState = { ...currentNavState, ...updates };
    // Check if the new state is identical to current state to prevent duplicate pushes
    if (
      nextState.view === currentNavState.view &&
      nextState.activeMenu === currentNavState.activeMenu &&
      nextState.internalView === currentNavState.internalView
    ) {
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const normalizedView = (view || "").toLowerCase();
  
  let songsToDisplay = songs;
  if (normalizedView === "search") {
    songsToDisplay = searchSongs;
  } else if (activeMenu === "recent") {
    songsToDisplay = recentSongs;
  } else if (activeMenu?.startsWith("playlist-")) {
    const playlistId = activeMenu.replace("playlist-", "");
    const playlist = customPlaylists.find(p => p.id.toString() === playlistId);
    if (playlist) {
      songsToDisplay = playlist.songs;
    }
  }

  const { audioRef, currentIndex, currentSong, currentTime, isPlaying, loopEnabled, duration, isMuted, shuffleEnabled, playbackSpeed, volume, playSongAtIndex, handleTogglePlay, handleNext, handlePrev, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleToggleMute, handleToggleLoop, handleToggleShuffle, handleChangeSpeed, handleSeek, handleChangeVolume } = useAudioPlayer(songsToDisplay);

  useEffect(() => {
    if (currentSong) {
      setRecentSongs(prev => {
        const filtered = prev.filter(s => s.id !== currentSong.id);
        return [currentSong, ...filtered].slice(0, 30);
      });
    }
  }, [currentSong]);

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

  const fetchAllSongs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
      return res.data.results || [];
    } catch (error) {
      console.error("Error while fetching the songs", error);
      toast.error("Failed to fetch songs. Please try again later.");
      return [];
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSongs([]);
      return;
    }
    const fetchSearch = async () => {
      try {
        setIsSongsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/search/${encodeURIComponent(searchQuery)}`);
        setSearchSongs(res.data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSongsLoading(false);
      }
    };
    const debounce = setTimeout(fetchSearch, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const loadPlaylist = async (tag) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`);
      return res.data.results || [];
    } catch (error) {
      console.error("Failed to load playlist. ", error);
      toast.error(`Failed to load playlist "${tag}".`);
      return [];
    }
  };

  const loadArtistSongs = async (artistName) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs/artist/${encodeURIComponent(artistName)}`);
      return res.data.results || [];
    } catch (error) {
      console.error("Failed to load artist songs. ", error);
      toast.error(`Failed to load songs for "${artistName}".`);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { view, activeMenu } = currentNavState;
      const cacheKey = `${view}-${activeMenu}`;

      if (songsCache[cacheKey]) {
        setSongs(songsCache[cacheKey]);
        return;
      }

      if (view === "home") {
        setIsSongsLoading(true);
        let data = [];
        if (activeMenu === "home") data = await fetchAllSongs();
        else if (activeMenu === "genres") data = await loadPlaylist("pop");
        else if (activeMenu === "albums") data = await loadPlaylist("electronic");
        else if (activeMenu === "artists") data = await loadPlaylist("rock");
        else if (activeMenu === "radio") data = await loadPlaylist("jazz");
        else if (activeMenu?.startsWith("artist-")) data = await loadArtistSongs(activeMenu.replace("artist-", ""));
        else if (activeMenu?.startsWith("tag-")) data = await loadPlaylist(activeMenu.replace("tag-", ""));
        
        setSongs(data);
        if (data && data.length > 0) {
          setSongsCache(prev => ({ ...prev, [cacheKey]: data }));
        }
        setIsSongsLoading(false);
      }
    };
    fetchData();
  }, [currentNavState.activeMenu, currentNavState.view]);

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  }

  const handlePlayFavourite = (songs) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;
    const index = auth.user.favourites.findIndex((fav) => fav.id === songs.id);
    setSongs(auth.user.favourites);
    navigate({ view: "home", activeMenu: "home", internalView: "default" });
    setTimeout(() => {
      if (index != -1) {
        playSongAtIndex(index)
      }
    }, 0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      if (view !== "search") navigate({ view: "search", activeMenu: "search", internalView: "default" });
    } else {
      if (view === "search") navigate({ view: "home", activeMenu: "home", internalView: "default" });
    }
  };

  const handleResetExplore = () => {
    navigate({ view: "home", activeMenu: "home", internalView: "default" });
  };

  const handleCreatePlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name: name,
      songs: []
    };
    setCustomPlaylists([...customPlaylists, newPlaylist]);
    setOpenCreatePlaylist(false);
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
          onOpenEditProfile={() => setOpenEditProfile(true)}
          handleGoBack={handleGoBack}
          handleGoForward={handleGoForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />

        <div className="homepage-main-wrapper">
          {/* Left Sidebar */}
          <div className="homepage-sidebar">
            <SideMenu
              onNavigate={navigate}
              view={normalizedView}
              activeMenu={activeMenu}
              onOpenEditProfile={() => setOpenEditProfile(true)}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onResetExplore={handleResetExplore}
              onCreatePlaylist={() => setOpenCreatePlaylist(true)}
              customPlaylists={customPlaylists}
            />
          </div>

          {/* Main Content */}
          <div className="homepage-content">
            <MainArea
              view={normalizedView}
              activeMenu={activeMenu}
              internalView={internalView}
              onNavigate={navigate}
              currentIndex={currentIndex}

              // Pass currentSong and isPlaying to highlight correctly
              currentSong={currentSong}
              isPlaying={isPlaying}

              onSelectSong={handleSelectSong}
              onSelectArtist={(artist) => navigate({ view: "home", activeMenu: `artist-${artist.name}`, internalView: "see_all_charts" })}
              onSelectFavourite={handlePlayFavourite}
              onSelectTag={(tag) => navigate({ view: "home", activeMenu: `tag-${tag}`, internalView: "see_all_charts" })}
              songsToDisplay={songsToDisplay}
              searchQuery={searchQuery}
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

        {openCreatePlaylist && (
          <Modal onClose={() => setOpenCreatePlaylist(false)}>
            <CreatePlaylistModal
              onClose={() => setOpenCreatePlaylist(false)}
              onCreate={handleCreatePlaylist}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Homepage;

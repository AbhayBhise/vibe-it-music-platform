import React from "react";
import {
  AiOutlineHome,
  AiOutlineFolder,
  AiOutlineHeart,
} from "react-icons/ai";
import { MdLibraryMusic, MdAlbum, MdPerson, MdRadio, MdQueueMusic } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import "../../css/sidemenu/SideMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uiSlice";
import toast from 'react-hot-toast';

const SideMenu = ({
  setView,
  view,
  activeMenu,
  setActiveMenu,
  currentSong,
  isPlaying,
  onSelectTag,
  onResetExplore,
  onCreatePlaylist,
  customPlaylists = []
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleFavouriteClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("favourite");
    setActiveMenu("favourite");
  };

  const handleTagClick = (tag, menuName) => {
    if (onSelectTag) {
      onSelectTag(tag);
      setView("home");
      setActiveMenu(menuName);
    }
  };

  const handleHomeClick = () => {
    if (onResetExplore) {
      onResetExplore();
    } else {
      setView("home");
      setActiveMenu("home");
    }
  };

  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${activeMenu === item ? "active" : ""}`;

  return (
    <aside className="sidemenu-root">
      {/* Menu Section */}
      <div className="sidemenu-section">
        <h3 className="sidemenu-section-title">MENU</h3>
        <nav className="sidemenu-nav">
          <button
            className={getNavBtnClass("home")}
            onClick={handleHomeClick}
          >
            <AiOutlineHome className="sidemenu-nav-icon" size={20} />
            <span>Explore</span>
          </button>
          <button
            className={getNavBtnClass("genres")}
            onClick={() => handleTagClick("Pop", "genres")}
          >
            <MdLibraryMusic className="sidemenu-nav-icon" size={20} />
            <span>Genres (Pop)</span>
          </button>
          <button
            className={getNavBtnClass("albums")}
            onClick={() => handleTagClick("Top 50", "albums")}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Albums (Top 50)</span>
          </button>
          <button
            className={getNavBtnClass("artists")}
            onClick={() => handleTagClick("Rock", "artists")}
          >
            <MdPerson className="sidemenu-nav-icon" size={20} />
            <span>Artists (Rock)</span>
          </button>
          <button
            className={getNavBtnClass("radio")}
            onClick={() => handleTagClick("Global", "radio")}
          >
            <MdRadio className="sidemenu-nav-icon" size={20} />
            <span>Radio</span>
          </button>
        </nav>
      </div>

      {/* Library Section */}
      <div className="sidemenu-section">
        <h3 className="sidemenu-section-title">LIBRARY</h3>
        <nav className="sidemenu-nav">
          <button
            className={getNavBtnClass("recent")}
            onClick={() => { setView("home"); setActiveMenu("recent"); }}
          >
            <AiOutlineFolder className="sidemenu-nav-icon" size={20} />
            <span>Recent</span>
          </button>
          <button
            className={getNavBtnClass("myalbums")}
            onClick={() => { setView("home"); setActiveMenu("myalbums"); }}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Albums</span>
          </button>
          <button
            className={getNavBtnClass("myartists")}
            onClick={() => { setView("home"); setActiveMenu("myartists"); }}
          >
            <MdPerson className="sidemenu-nav-icon" size={20} />
            <span>Artists</span>
          </button>
          <button
            className={getNavBtnClass("local")}
            onClick={() => { toast("Local file playback coming soon!", { icon: "🚧" }); }}
          >
            <AiOutlineFolder className="sidemenu-nav-icon" size={20} />
            <span>Local</span>
          </button>
        </nav>
      </div>

      {/* Playlist Section */}
      <div className="sidemenu-section">
        <h3 className="sidemenu-section-title">PLAYLIST</h3>
        <nav className="sidemenu-nav">
          <button
            className={getNavBtnClass("create")}
            onClick={() => onCreatePlaylist && onCreatePlaylist()}
          >
            <span className="create-icon">+</span>
            <span>Create New</span>
          </button>
          <button
            className={getNavBtnClass("design")}
            onClick={() => handleTagClick("Design Flow", "design")}
          >
            <MdQueueMusic className="sidemenu-nav-icon" size={20} />
            <span>Design Flow</span>
          </button>
          <button
            className={getNavBtnClass("favourite")}
            onClick={handleFavouriteClick}
          >
            <AiOutlineHeart className="sidemenu-nav-icon" size={20} />
            <span>Favourites</span>
          </button>
          <button
            className={getNavBtnClass("nightjams")}
            onClick={() => handleTagClick("Night Jams", "nightjams")}
          >
            <MdQueueMusic className="sidemenu-nav-icon" size={20} />
            <span>Nighte Jams</span>
          </button>

          {/* User Created Playlists */}
          {customPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              className={getNavBtnClass(`playlist-${playlist.id}`)}
              onClick={() => {
                setView("home");
                setActiveMenu(`playlist-${playlist.id}`);
              }}
            >
              <MdQueueMusic className="sidemenu-nav-icon" size={20} />
              <span>{playlist.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1"></div>

      {/* Mini Player Card */}
      {currentSong && (
        <div className="sidemenu-mini-player">
          <img
            src={currentSong.image}
            alt={currentSong.name}
            className="mini-player-artwork"
          />
          <div className="mini-player-info">
            <h4 className="mini-player-title">{currentSong.name}</h4>
            <p className="mini-player-artist">Playing on Shuffle</p>
          </div>
          <div className="mini-player-play-icon">
            {isPlaying ? (
              <FaPause size={12} />
            ) : (
              <FaPlay size={12} />
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideMenu;

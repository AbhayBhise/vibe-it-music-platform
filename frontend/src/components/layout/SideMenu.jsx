import React from "react";
import { IoIosSettings } from "react-icons/io";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineFolder,
} from "react-icons/ai";
import { MdLibraryMusic, MdAlbum, MdPerson, MdRadio } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import "../../css/sidemenu/SideMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uiSlice";

const SideMenu = ({ setView, view, onOpenEditProfile, currentSong, isPlaying }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("Search");
  };

  const handleFavouriteClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("favourite");
  };

  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;

  return (
    <aside className="sidemenu-root">
      {/* Menu Section */}
      <div className="sidemenu-section">
        <h3 className="sidemenu-section-title">MENU</h3>
        <nav className="sidemenu-nav">
          <button
            className={getNavBtnClass("home")}
            onClick={() => setView("home")}
          >
            <AiOutlineHome className="sidemenu-nav-icon" size={20} />
            <span>Explore</span>
          </button>
          <button
            className={getNavBtnClass("genres")}
            onClick={() => setView("home")}
          >
            <MdLibraryMusic className="sidemenu-nav-icon" size={20} />
            <span>Genres</span>
          </button>
          <button
            className={getNavBtnClass("albums")}
            onClick={() => setView("home")}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Albums</span>
          </button>
          <button
            className={getNavBtnClass("artists")}
            onClick={() => setView("home")}
          >
            <MdPerson className="sidemenu-nav-icon" size={20} />
            <span>Artists</span>
          </button>
          <button
            className={getNavBtnClass("radio")}
            onClick={() => setView("home")}
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
            onClick={() => setView("home")}
          >
            <AiOutlineFolder className="sidemenu-nav-icon" size={20} />
            <span>Recent</span>
          </button>
          <button
            className={getNavBtnClass("myalbums")}
            onClick={() => setView("home")}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Albums</span>
          </button>
          <button
            className={getNavBtnClass("myartists")}
            onClick={() => setView("home")}
          >
            <MdPerson className="sidemenu-nav-icon" size={20} />
            <span>Artists</span>
          </button>
          <button
            className={getNavBtnClass("local")}
            onClick={() => setView("home")}
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
            onClick={() => setView("home")}
          >
            <span className="create-icon">+</span>
            <span>Create New</span>
          </button>
          <button
            className={getNavBtnClass("design")}
            onClick={() => setView("home")}
          >
            <span>Design Flow</span>
          </button>
          <button
            className={getNavBtnClass("favourite")}
            onClick={handleFavouriteClick}
          >
            <span>Favourites</span>
          </button>
          <button
            className={getNavBtnClass("nightjams")}
            onClick={() => setView("home")}
          >
            <span>Nighte Jams</span>
          </button>
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

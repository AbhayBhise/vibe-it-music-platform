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
  onNavigate,
  view,
  activeMenu,
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
    onNavigate({ view: "favourite", activeMenu: "favourite", internalView: "default" });
  };

  const handleTagClick = (tag, menuName) => {
    onNavigate({ view: "home", activeMenu: menuName, internalView: "see_all_charts" });
  };

  const handleHomeClick = () => {
    if (onResetExplore) {
      onResetExplore();
    } else {
      onNavigate({ view: "home", activeMenu: "home", internalView: "default" });
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
            onClick={() => handleTagClick("pop", "genres")}
          >
            <MdLibraryMusic className="sidemenu-nav-icon" size={20} />
            <span>Pop Hits</span>
          </button>
          <button
            className={getNavBtnClass("albums")}
            onClick={() => handleTagClick("electronic", "albums")}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Electronic</span>
          </button>
          <button
            className={getNavBtnClass("artists")}
            onClick={() => handleTagClick("rock", "artists")}
          >
            <MdPerson className="sidemenu-nav-icon" size={20} />
            <span>Rock Classics</span>
          </button>
          <button
            className={getNavBtnClass("radio")}
            onClick={() => handleTagClick("jazz", "radio")}
          >
            <MdRadio className="sidemenu-nav-icon" size={20} />
            <span>Jazz Radio</span>
          </button>
        </nav>
      </div>

      {/* Library Section */}
      <div className="sidemenu-section">
        <h3 className="sidemenu-section-title">LIBRARY</h3>
        <nav className="sidemenu-nav">
          <button
            className={getNavBtnClass("recent")}
            onClick={() => onNavigate({ view: "home", activeMenu: "recent", internalView: "see_all_charts" })}
          >
            <AiOutlineFolder className="sidemenu-nav-icon" size={20} />
            <span>Recent</span>
          </button>
          <button
            className={getNavBtnClass("myalbums")}
            onClick={() => onNavigate({ view: "home", activeMenu: "myalbums", internalView: "see_all_genres" })}
          >
            <MdAlbum className="sidemenu-nav-icon" size={20} />
            <span>Albums</span>
          </button>
          <button
            className={getNavBtnClass("myartists")}
            onClick={() => onNavigate({ view: "home", activeMenu: "myartists", internalView: "see_all_artists" })}
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
            className={getNavBtnClass("favourite")}
            onClick={handleFavouriteClick}
          >
            <AiOutlineHeart className="sidemenu-nav-icon" size={20} />
            <span>Favourites</span>
          </button>

          {/* User Created Playlists */}
          {customPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              className={getNavBtnClass(`playlist-${playlist.id}`)}
              onClick={() => {
                onNavigate({ view: "home", activeMenu: `playlist-${playlist.id}`, internalView: "see_all_charts" });
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

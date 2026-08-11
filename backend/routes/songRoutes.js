import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSongs, getPlaylistByTag, toggleFavourite, searchSongs, getSongsByArtist } from "../controllers/songController.js";
const songRouter = express.Router();

songRouter.get("/",getSongs);
songRouter.get("/playlistByTag/:tag",getPlaylistByTag);
songRouter.get("/search/:query", searchSongs);
songRouter.get("/artist/:name", getSongsByArtist);
songRouter.post("/favourite",protect,toggleFavourite);
songRouter.get("/favourites",protect,(req,res)=>{
    res.json(req.user.favourites);
} );
export default songRouter;

import axios from "axios";
import asyncHandler from "express-async-handler";
import NodeCache from "node-cache";

// Cache for 15 minutes
const cache = new NodeCache({ stdTTL: 900 });
const getClientId = () => process.env.JAMENDO_CLIENT_ID || "990ab75c";

const getSongs = asyncHandler(async (req, res) => {
    const cacheKey = "all_songs";
    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${getClientId()}&format=jsonpretty&limit=20`);
    const data = response.data;
    
    if (data?.headers?.status === "failed") {
        return res.status(400).json(data);
    }
    
    cache.set(cacheKey, data);
    res.status(200).json(data);
});

const getPlaylistByTag = asyncHandler(async (req, res) => {
    const tag = (req.params.tag || req.query.tag)?.toString().trim();
    if (!tag) {
        res.status(400);
        throw new Error("Tag is required");
    }
    const limit = parseInt(req.query.limit ?? "10", 10) || 10;
    
    const cacheKey = `playlist_${tag}_${limit}`;
    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${getClientId()}&format=jsonpretty&tags=${tag}&limit=${limit}`;
    const response = await axios.get(url);

    if (response.data?.headers?.status === "failed") {
        return res.status(400).json(response.data);
    }

    cache.set(cacheKey, response.data);
    res.status(200).json(response.data);
});

const toggleFavourite = asyncHandler(async (req, res) => {
    const user = req.user;
    const song = req.body.song;
    const exists = user.favourites.find((fav => fav.id === song.id));
    let msg = "";
    if (exists) {
        user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
        msg = "Song removed from favourites.";
    }
    else {
        user.favourites.push(song);
        msg = "Song added to favourites.";
    }
    await user.save();
    res.status(200).json({ message: msg, favourites: user.favourites });
});

const searchSongs = asyncHandler(async (req, res) => {
    const query = req.params.query?.toString().trim();
    if (!query) {
        res.status(400);
        throw new Error("Search query is required");
    }
    const limit = parseInt(req.query.limit ?? "20", 10) || 20;
    
    const cacheKey = `search_${query}_${limit}`;
    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${getClientId()}&format=jsonpretty&namesearch=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await axios.get(url);

    if (response.data?.headers?.status === "failed") {
        return res.status(400).json(response.data);
    }

    cache.set(cacheKey, response.data);
    res.status(200).json(response.data);
});

const getSongsByArtist = asyncHandler(async (req, res) => {
    const artistName = req.params.name?.toString().trim();
    if (!artistName) {
        res.status(400);
        throw new Error("Artist name is required");
    }
    const limit = parseInt(req.query.limit ?? "20", 10) || 20;
    
    const cacheKey = `artist_${artistName}_${limit}`;
    if (cache.has(cacheKey)) {
        return res.status(200).json(cache.get(cacheKey));
    }

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${getClientId()}&format=jsonpretty&artist_name=${encodeURIComponent(artistName)}&limit=${limit}`;
    const response = await axios.get(url);

    if (response.data?.headers?.status === "failed") {
        return res.status(400).json(response.data);
    }

    cache.set(cacheKey, response.data);
    res.status(200).json(response.data);
});

export { getSongs, getPlaylistByTag, toggleFavourite, searchSongs, getSongsByArtist };
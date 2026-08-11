import axios from "axios";

const getSongs = async (req, res) => {

    try {
        // Implementation for fetching songs
        const clientId = process.env.JAMENDO_CLIENT_ID || "990ab75c";
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&limit=20`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching songs:", error.message);
        res.status(500).json({ message: "Error fetching songs, : " + error.message });
    }
}

const getPlaylistByTag = async (req, res) => {
    try {
        const tag = (req.params.tag || req.query.tag).toString().trim();
        if (!tag) {
            return res.status(400).json({ message: "Tag is required" });
        }
        const limit = parseInt(req.query.limit ?? "10", 10) || 10;
        const clientId = process.env.JAMENDO_CLIENT_ID || "990ab75c";
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&tags=${tag}&limit=${limit}`;
        const response = await axios.get(url);

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching playlist by tag:", error?.response?.data ?? error.message);
        res.status(500).json({ message: "Error fetching playlist by tag, : " + error.message });
    }

}

const toggleFavourite = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error toggling favourite song:", error.message);
        res.status(400).json({ message: "Error toggling favourite song, : " + error.message });
    }
};

const searchSongs = async (req, res) => {
    try {
        const query = req.params.query?.toString().trim();
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const limit = parseInt(req.query.limit ?? "20", 10) || 20;
        const clientId = process.env.JAMENDO_CLIENT_ID || "990ab75c";
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&namesearch=${encodeURIComponent(query)}&limit=${limit}`;
        const response = await axios.get(url);

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error searching songs:", error?.response?.data ?? error.message);
        res.status(500).json({ message: "Error searching songs, : " + error.message });
    }
}

export { getSongs, getPlaylistByTag, toggleFavourite, searchSongs };
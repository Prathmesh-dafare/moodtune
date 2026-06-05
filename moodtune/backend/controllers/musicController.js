const fetch = require("node-fetch");

// Mood keywords for iTunes search
const HINDI_QUERIES = {
  happy: "bollywood hindi songs",
  sad: "bollywood sad songs",
  relaxed: "hindi lofi songs",
  energetic: "bollywood workout songs",
  romantic: "bollywood romantic songs",
  angry: "hindi rock songs",
  motivated: "bollywood motivational songs",
  party: "bollywood dance songs",
};

const ENGLISH_QUERIES = {
  happy: "pop hits",
  sad: "acoustic sad songs",
  relaxed: "chill lofi",
  energetic: "workout music",
  romantic: "love songs",
  angry: "rock music",
  motivated: "motivational songs",
  party: "dance hits",
};

const ERA_QUERIES = {
  "80s": "1980 hits",
  "90s": "1990 hits",
  "2000s": "2000 hits",
  "2010s": "2010 hits",
  latest: "latest hits",
};

// Get recommendations
const getRecommendations = async (req, res) => {
  try {
    const { mood } = req.params;

    const language = req.query.language || "hindi";
    const era = req.query.era || "latest";

    let query = "";

    // Base Mood Query
    if (language === "english") {
      query = ENGLISH_QUERIES[mood] || "music";
    } else {
      query = HINDI_QUERIES[mood] || "music";
    }
    if (language === "hindi") {
      query += " bollywood hindi";
    }

    // Add Era
    query += " " + (ERA_QUERIES[era] || "");

    // Better Era Recommendations
    if (language === "hindi" && era === "80s") {
      query = "Kishore Kumar Lata Mangeshkar";
    }

    if (language === "hindi" && era === "90s") {
      query = "Kumar Sanu Udit Narayan Alka Yagnik";
    }

    if (language === "hindi" && era === "2000s") {
      query = "KK Sonu Nigam Shaan";
    }

    if (language === "english" && era === "80s") {
      query = "Michael Jackson Madonna";
    }

    if (language === "english" && era === "90s") {
      query = "Backstreet Boys Westlife";
    }

    if (language === "english" && era === "2000s") {
      query = "Linkin Park Eminem";
    }

    console.log("========== MUSIC FILTERS ==========");
    console.log("Mood:", mood);
    console.log("Language:", language);
    console.log("Era:", era);
    console.log("Query:", query);

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query,
      )}&entity=song&limit=20`,
    );

    const data = await response.json();

    const tracks = (data.results || []).map((track) => ({
      id: track.trackId,

      title: track.trackName,

      artist: track.artistName,

      album: track.collectionName,

      image:
        track.artworkUrl100?.replace("100x100", "600x600") ||
        "https://picsum.photos/600",

      preview: track.previewUrl,

      duration: Math.floor((track.trackTimeMillis || 0) / 1000),

      appleUrl: track.trackViewUrl,

      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(
        `${track.trackName} ${track.artistName}`,
      )}`,

      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${track.trackName} ${track.artistName}`,
      )}`,
    }));

    res.json({
      success: true,
      mood,
      language,
      era,
      tracks,
    });
  } catch (error) {
    console.error("Recommendations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch music recommendations.",
    });
  }
};
// Search songs
const searchMusic = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a search term.",
      });
    }

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=20`,
    );

    const data = await response.json();

    const tracks = (data.results || []).map((track) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      image: track.artworkUrl100?.replace("100x100", "600x600"),

      preview: track.previewUrl,

      duration: Math.floor((track.trackTimeMillis || 0) / 1000),

      appleUrl: track.trackViewUrl,

      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(
        `${track.trackName} ${track.artistName}`,
      )}`,

      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${track.trackName} ${track.artistName}`,
      )}`,
    }));
    res.json({
      success: true,
      tracks,
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed.",
    });
  }
};

module.exports = {
  getRecommendations,
  searchMusic,
};

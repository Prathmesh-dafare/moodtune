// controllers/moodController.js - AI mood detection + history
const fetch = require("node-fetch");
const MoodHistory = require("../models/MoodHistory");

// Keyword-based fallback mood detection
const MOOD_KEYWORDS = {
  happy: [
    "happy",
    "joy",
    "excited",
    "great",
    "amazing",
    "wonderful",
    "fantastic",
    "awesome",
    "cheerful",
    "good",
    "glad",
    "elated",
    "thrilled",
    "delighted",
    "pleased",
    "bliss",
    "laugh",
    "smile",
    "fun",
    "celebrate",
    "birthday",
  ],
  sad: [
    "sad",
    "lonely",
    "depressed",
    "unhappy",
    "crying",
    "tears",
    "miss",
    "lost",
    "heartbreak",
    "grief",
    "sorrow",
    "miserable",
    "down",
    "gloomy",
    "blue",
    "melancholy",
    "broken",
    "hurt",
    "pain",
    "hopeless",
  ],
  angry: [
    "angry",
    "mad",
    "furious",
    "rage",
    "annoyed",
    "frustrated",
    "irritated",
    "hate",
    "upset",
    "pissed",
    "infuriated",
    "outraged",
    "bitter",
    "resentful",
    "hostile",
  ],
  relaxed: [
    "relaxed",
    "calm",
    "peaceful",
    "chill",
    "serene",
    "tranquil",
    "comfortable",
    "ease",
    "quiet",
    "still",
    "gentle",
    "soft",
    "mellow",
    "slow",
    "rest",
    "unwind",
    "breathe",
  ],
  energetic: [
    "energetic",
    "hyper",
    "active",
    "pumped",
    "workout",
    "run",
    "exercise",
    "gym",
    "energy",
    "strong",
    "powerful",
    "dynamic",
    "lively",
    "vigorous",
    "intense",
  ],
  romantic: [
    "romantic",
    "love",
    "crush",
    "heart",
    "date",
    "relationship",
    "partner",
    "sweet",
    "affection",
    "passion",
    "longing",
    "adore",
    "cherish",
    "tenderness",
    "intimate",
    "couple",
  ],
  motivated: [
    "motivated",
    "inspired",
    "determined",
    "focused",
    "goal",
    "achieve",
    "success",
    "hustle",
    "grind",
    "ambition",
    "drive",
    "push",
    "work",
    "study",
    "exam",
    "stress",
    "deadline",
    "productive",
  ],
  party: [
    "party",
    "dance",
    "club",
    "weekend",
    "celebrate",
    "friends",
    "fun",
    "drink",
    "night out",
    "festival",
    "concert",
    "rave",
    "groove",
    "beat",
    "music",
    "lit",
  ],
};

// Detect mood from text using keyword matching
const detectMoodByKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const scores = {};

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    scores[mood] = keywords.filter((kw) => lowerText.includes(kw)).length;
  }

  const topMood = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return topMood[1] > 0 ? topMood[0] : "relaxed"; // Default to relaxed if no match
};

// Map HuggingFace emotion labels to our mood categories
const mapHFToMood = (hfLabels) => {
  const topLabel = hfLabels[0]?.label?.toLowerCase() || "";
  const labelMoodMap = {
    joy: "happy",
    happiness: "happy",
    love: "romantic",
    surprise: "energetic",
    fear: "sad",
    sadness: "sad",
    anger: "angry",
    disgust: "angry",
    neutral: "relaxed",
  };
  return labelMoodMap[topLabel] || "relaxed";
};

// @desc    Analyze mood from text using AI
// @route   POST /api/mood/analyze
// @access  Private
const analyzeMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least 3 characters.",
      });
    }

    let mood = "relaxed";
    let method = "keyword";

    // Try HuggingFace API first
    if (
      process.env.HUGGINGFACE_API_KEY &&
      process.env.HUGGINGFACE_API_KEY !== "hf_your_token_here"
    ) {
      try {
        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
            timeout: 8000,
          },
        );

        if (hfResponse.ok) {
          const hfData = await hfResponse.json();
          if (Array.isArray(hfData) && hfData[0]) {
            mood = mapHFToMood(hfData[0]);
            method = "ai";
          }
        }
      } catch (hfError) {
        console.log(
          "HuggingFace API unavailable, using keyword fallback:",
          hfError.message,
        );
        mood = detectMoodByKeywords(text);
      }
    } else {
      // Use keyword fallback
      mood = detectMoodByKeywords(text);
    }

    res.json({
      success: true,
      mood,
      method,
      text: text.substring(0, 200),
    });
  } catch (error) {
    console.error("Mood analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze mood.",
    });
  }
};

// @desc    Save mood to history
// @route   POST /api/mood/save
// @access  Private
const saveMood = async (req, res) => {
  try {
    const { mood, inputText, detectionMethod } = req.body;

    const validMoods = [
      "happy",
      "sad",
      "relaxed",
      "energetic",
      "romantic",
      "angry",
      "motivated",
      "party",
    ];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ success: false, message: "Invalid mood." });
    }

    const moodEntry = await MoodHistory.create({
      userId: req.user._id,
      mood,
      inputText: inputText || null,
      detectionMethod: detectionMethod || "manual",
    });

    res.status(201).json({ success: true, moodEntry });
  } catch (error) {
    console.error("Save mood error:", error);
    res.status(500).json({ success: false, message: "Failed to save mood." });
  }
};

// @desc    Get user mood history
// @route   GET /api/mood/history
// @access  Private
const getMoodHistory = async (req, res) => {
  try {
    const history = await MoodHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({ success: true, history });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch mood history." });
  }
};

module.exports = { analyzeMood, saveMood, getMoodHistory };

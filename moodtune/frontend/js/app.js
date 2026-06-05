// js/app.js - Core utilities, API client, toast notifications

// ======================================
// CONFIG
// ======================================
const CONFIG = {
  API_BASE: "http://localhost:5000/api",

  TOKEN_KEY: "moodtune_token",
  USER_KEY: "moodtune_user",
};
// ======================================
// AUTH UTILITIES
// ======================================
const Auth = {
  getToken: () => localStorage.getItem(CONFIG.TOKEN_KEY),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
    } catch {
      return null;
    }
  },
  setSession: (token, user) => {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },
  isLoggedIn: () => !!localStorage.getItem(CONFIG.TOKEN_KEY),
  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  },

  redirectIfLoggedIn: () => {
    if (Auth.isLoggedIn()) {
      window.location.href = "dashboard.html";
      return true;
    }
    return false;
  },
};

// ======================================
// API CLIENT
// ======================================
const API = {
  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (response.status === 401) {
        Auth.clearSession();
        window.location.href = "login.html";
        return null;
      }

      return { ok: response.ok, status: response.status, data };
    } catch (error) {
      console.error("API Error:", error);
      return {
        ok: false,
        data: { message: "Network error. Please check your connection." },
      };
    }
  },

  get: (endpoint) => API.request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    API.request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    API.request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => API.request(endpoint, { method: "DELETE" }),
};

// ======================================
// TOAST NOTIFICATIONS
// ======================================
const Toast = {
  container: null,

  init() {
    this.container = document.createElement("div");
    this.container.className = "toast-container-custom";
    document.body.appendChild(this.container);
  },

  show(message, type = "info", duration = 3500) {
    if (!this.container) this.init();

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      info: "fa-info-circle",
      warning: "fa-exclamation-triangle",
    };

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("removing");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success: (msg) => Toast.show(msg, "success"),
  error: (msg) => Toast.show(msg, "error"),
  info: (msg) => Toast.show(msg, "info"),
  warning: (msg) => Toast.show(msg, "warning"),
};

// Initialize toast
Toast.init();

// ======================================
// NAVBAR SCROLL EFFECT
// ======================================
const initNavbar = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
};

// ======================================
// MOOD CONFIG
// ======================================
const MOODS = {
  happy: {
    emoji: "😊",
    label: "Happy",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    shadow: "rgba(245, 158, 11, 0.3)",
    border: "rgba(245, 158, 11, 0.5)",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    shadow: "rgba(96, 165, 250, 0.3)",
    border: "rgba(96, 165, 250, 0.5)",
  },
  relaxed: {
    emoji: "😌",
    label: "Relaxed",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    shadow: "rgba(52, 211, 153, 0.3)",
    border: "rgba(52, 211, 153, 0.5)",
  },
  energetic: {
    emoji: "💪",
    label: "Energetic",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    shadow: "rgba(249, 115, 22, 0.3)",
    border: "rgba(249, 115, 22, 0.5)",
  },
  romantic: {
    emoji: "❤️",
    label: "Romantic",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #f9a8d4)",
    shadow: "rgba(236, 72, 153, 0.3)",
    border: "rgba(236, 72, 153, 0.5)",
  },
  angry: {
    emoji: "😡",
    label: "Angry",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    shadow: "rgba(239, 68, 68, 0.3)",
    border: "rgba(239, 68, 68, 0.5)",
  },
  motivated: {
    emoji: "🔥",
    label: "Motivated",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    shadow: "rgba(167, 139, 250, 0.3)",
    border: "rgba(167, 139, 250, 0.5)",
  },
  party: {
    emoji: "🎉",
    label: "Party",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, #06b6d4, #22d3ee)",
    shadow: "rgba(34, 211, 238, 0.3)",
    border: "rgba(34, 211, 238, 0.5)",
  },
};

// ======================================
// AUDIO PLAYER
// ======================================
const Player = {
  audio: null,
  currentSong: null,
  playerEl: null,
  isPlaying: false,

  init() {
    this.audio = new Audio();
    this.playerEl = document.getElementById("audioPlayer");

    if (!this.playerEl) return;

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.onEnded());
    this.audio.addEventListener("loadstart", () => this.setLoading(true));
    this.audio.addEventListener("canplay", () => this.setLoading(false));
  },

  play(song) {
    if (!song.preview) {
      Toast.warning("No preview available for this track");
      return;
    }

    if (this.currentSong?.id === song.id && this.isPlaying) {
      this.pause();
      return;
    }

    this.currentSong = song;
    this.audio.src = song.preview;
    this.audio.play().catch((e) => console.log("Playback error:", e));
    this.isPlaying = true;
    this.updatePlayerUI();
    this.showPlayer();
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  },

  resume() {
    this.audio.play().catch((e) => console.log("Playback error:", e));
    this.isPlaying = true;
    this.updatePlayButton();
  },

  toggle() {
    if (this.isPlaying) this.pause();
    else this.resume();
  },

  showPlayer() {
    if (this.playerEl) this.playerEl.classList.add("active");
  },

  updatePlayerUI() {
    if (!this.playerEl || !this.currentSong) return;
    const s = this.currentSong;
    const imgEl = this.playerEl.querySelector(".player-thumb");
    const titleEl = this.playerEl.querySelector(".player-title");
    const artistEl = this.playerEl.querySelector(".player-artist");

    if (imgEl) imgEl.src = s.image || "";
    if (titleEl) titleEl.textContent = s.title || "";
    if (artistEl) artistEl.textContent = s.artist || "";

    this.updatePlayButton();
  },

  updatePlayButton() {
    const btn = this.playerEl?.querySelector(".player-btn.play i");
    if (btn) {
      btn.className = this.isPlaying ? "fas fa-pause" : "fas fa-play";
    }
  },

  updateProgress() {
    const fill = this.playerEl?.querySelector(".progress-fill");
    const current = this.playerEl?.querySelector("#currentTime");
    const total = this.playerEl?.querySelector("#totalTime");

    if (!this.audio.duration) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    if (fill) fill.style.width = `${pct}%`;
    if (current) current.textContent = this.formatTime(this.audio.currentTime);
    if (total) total.textContent = this.formatTime(this.audio.duration);
  },

  onEnded() {
    this.isPlaying = false;
    this.updatePlayButton();
  },

  setLoading(loading) {
    const playBtn = this.playerEl?.querySelector(".player-btn.play i");
    if (playBtn && loading) playBtn.className = "fas fa-spinner fa-spin";
    else if (playBtn && !loading) this.updatePlayButton();
  },

  seekTo(pct) {
    if (this.audio.duration) {
      this.audio.currentTime = this.audio.duration * pct;
    }
  },

  formatTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  },
};

// ======================================
// FAVORITES MANAGER
// ======================================
const Favorites = {
  ids: new Set(),

  async load() {
    if (!Auth.isLoggedIn()) return;
    const res = await API.get("/favorites");
    if (res?.ok) {
      this.ids = new Set(res.data.favorites.map((f) => String(f.songId)));
    }
  },

  isFavorited: (songId) => Favorites.ids.has(String(songId)),

  async toggle(song) {
    const songIdStr = String(song.id);
    if (this.isFavorited(songIdStr)) {
      const res = await API.delete(`/favorites/remove/${songIdStr}`);
      if (res?.ok) {
        this.ids.delete(songIdStr);
        Toast.info("Removed from favorites");
        return false;
      }
    } else {
      const res = await API.post("/favorites/add", {
        songId: songIdStr,
        title: song.title,
        artist: song.artist,
        album: song.album,
        image: song.image,
        preview: song.preview,
        mood: song.mood,
      });
      if (res?.ok) {
        this.ids.add(songIdStr);
        Toast.success("Added to favorites! ❤️");
        return true;
      } else {
        Toast.error(res?.data?.message || "Failed to update favorites");
        return null;
      }
    }
  },
};

// ======================================
// RENDER MUSIC CARDS
// ======================================
const renderMusicCards = (tracks, containerId, currentMood = null) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!tracks || tracks.length === 0) {
    container.innerHTML = `
      <div class="empty-state col-12">
        <div class="empty-state-icon">🎵</div>
        <div class="empty-state-title">No songs found</div>
        <div class="empty-state-subtitle">Try a different mood or search term</div>
      </div>`;
    return;
  }

  container.innerHTML = tracks
    .map((track) => {
      const isFav = Favorites.isFavorited(track.id);
      const songWithMood = { ...track, mood: currentMood };

      return `
      <div class="music-card" data-id="${track.id}">
        
        <div class="music-card-img-container">
          <img
            src="${track.image || "https://picsum.photos/seed/" + track.id + "/300/300"}"
            class="music-card-img"
            alt="${track.title}"
            onerror="this.src='https://picsum.photos/seed/${track.id}/300/300'"
          >

          <div class="music-card-overlay">
            ${
              track.preview
                ? `
                <button class="play-btn"
                  onclick='playTrack(${JSON.stringify(songWithMood)})'>
                  <i class="fas fa-play"></i>
                </button>
              `
                : `
                <button class="play-btn" disabled style="opacity:0.5;">
                  <i class="fas fa-ban"></i>
                </button>
              `
            }
          </div>
        </div>

        <div class="music-card-body">
          <div class="music-title">${escapeHtml(track.title)}</div>
          <div class="music-artist">${escapeHtml(track.artist)}</div>

          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;">
            <i class="fas fa-compact-disc me-1"></i>
            ${escapeHtml(track.album || "")}
          </div>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 12px;">

          ${
            track.spotifyUrl
              ? `
              <a href="${track.spotifyUrl}"
                 target="_blank"
                 class="btn btn-sm"
                 style="background:#1DB954;color:white;border:none;">
                 <i class="fab fa-spotify"></i>
              </a>
            `
              : ""
          }

          ${
            track.youtubeUrl
              ? `
              <a href="${track.youtubeUrl}"
                 target="_blank"
                 class="btn btn-sm"
                 style="background:#FF0000;color:white;border:none;">
                 <i class="fab fa-youtube"></i>
              </a>
            `
              : ""
          }

          ${
            track.appleUrl
              ? `
              <a href="${track.appleUrl}"
                 target="_blank"
                 class="btn btn-sm"
                 style="background:#fc3c44;color:white;border:none;">
                 <i class="fab fa-apple"></i>
              </a>
            `
              : ""
          }

        </div>

        <div class="music-card-footer">
          <button
            class="fav-btn ${isFav ? "active" : ""}"
            onclick='toggleFavorite(this, ${JSON.stringify(songWithMood)})'>

            <i class="${isFav ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>

      </div>
      `;
    })
    .join("");
};
// Global play function (called from card HTML)
window.playTrack = (song) => Player.play(song);

// Global toggle favorite (called from card HTML)
window.toggleFavorite = async (btn, song) => {
  const result = await Favorites.toggle(song);
  if (result === null) return;
  btn.classList.toggle("active", result);
  btn.querySelector("i").className = result ? "fas fa-heart" : "far fa-heart";
};

// ======================================
// UTILS
// ======================================
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  Player.init();
});

// Progress bar click to seek
document.addEventListener("click", (e) => {
  const container = e.target.closest(".progress-bar-container");
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  Player.seekTo(pct);
});

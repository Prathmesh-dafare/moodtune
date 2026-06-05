# 🎵 MoodTune – AI Mood-Based Music Recommendation Platform

> Discover music that perfectly matches your mood using AI-powered emotion detection and Deezer's 90M+ song library.

![MoodTune](https://img.shields.io/badge/MoodTune-v1.0.0-purple)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- 🤖 **AI Mood Detection** — Type how you feel; Hugging Face NLP analyzes your emotion
- 🎭 **8 Mood Categories** — Happy, Sad, Relaxed, Energetic, Romantic, Angry, Motivated, Party
- 🎵 **Music Recommendations** — Real songs from Deezer's 90M+ library with 30-second previews
- ❤️ **Favorites Playlist** — Save songs, build your personal mood-based playlist
- 📊 **Mood History** — Track your emotional journey over time
- 🔍 **Music Search** — Search any song, artist, or album
- 👤 **User Profiles** — JWT-authenticated accounts with stats
- 📱 **Fully Responsive** — Mobile, tablet, laptop, desktop

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, CSS3, Vanilla JS, Bootstrap 5, Font Awesome, AOS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Free Tier) |
| Auth | JWT + bcrypt |
| Music API | Deezer (Free, no key needed) |
| AI API | Hugging Face Inference (Free Tier) |
| Deployment | Netlify (frontend) + Render (backend) |

---

## 📁 Project Structure

```
moodtune/
├── frontend/
│   ├── index.html              # Landing page
│   ├── css/
│   │   └── style.css           # All styles
│   ├── js/
│   │   └── app.js              # Core JS utilities
│   └── pages/
│       ├── login.html
│       ├── register.html
│       ├── dashboard.html
│       ├── mood.html           # AI mood detection
│       ├── music.html          # Recommendations
│       ├── search.html
│       ├── favorites.html
│       ├── history.html
│       └── profile.html
│
└── backend/
    ├── server.js               # Express entry point
    ├── package.json
    ├── .env.example
    ├── config/
    │   └── database.js         # MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── MoodHistory.js
    │   └── FavoriteSong.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── moodController.js
    │   ├── musicController.js
    │   └── favoritesController.js
    ├── routes/
    │   ├── auth.js
    │   ├── user.js
    │   ├── mood.js
    │   ├── music.js
    │   └── favorites.js
    └── middleware/
        └── auth.js             # JWT middleware
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free at [cloud.mongodb.com](https://cloud.mongodb.com))
- Hugging Face account (free at [huggingface.co](https://huggingface.co)) — optional

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/moodtune.git
cd moodtune
```

### 2. Set Up Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/moodtune
JWT_SECRET=your_random_secret_string_here
HUGGINGFACE_API_KEY=hf_your_token_here   # Optional
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Set Up Frontend

The frontend is static HTML — no build step needed.

Open in a local server:
```bash
# Using VS Code Live Server extension, OR:
cd frontend
npx serve .
# OR:
python -m http.server 3000
```

Visit `http://localhost:3000`

### 4. Update API URL

In `frontend/js/app.js`, update `CONFIG.API_BASE`:

```javascript
const CONFIG = {
  API_BASE: window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://YOUR-RENDER-URL.onrender.com/api'
};
```

---

## ☁️ Deployment

### Backend → Render (Free)

1. Push your backend to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, select the `backend` folder
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables (same as `.env`)
6. Deploy — note your URL: `https://moodtune-api.onrender.com`

### Frontend → Netlify (Free)

1. Go to [netlify.com](https://netlify.com) → New Site from Git
2. Connect GitHub, select the `frontend` folder
3. No build command needed (static HTML)
4. **Important:** Update `CONFIG.API_BASE` in `js/app.js` with your Render URL
5. Deploy!

### Database → MongoDB Atlas (Free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Allow access from anywhere: `0.0.0.0/0` in Network Access
5. Get your connection string and add to backend `.env`

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/user/profile` | ✅ | Get profile + stats |
| PUT | `/api/user/profile` | ✅ | Update name |
| POST | `/api/mood/analyze` | ✅ | AI mood detection |
| POST | `/api/mood/save` | ✅ | Save mood to history |
| GET | `/api/mood/history` | ✅ | Get mood history |
| GET | `/api/music/recommendations/:mood` | ✅ | Get songs by mood |
| GET | `/api/music/search?q=query` | ✅ | Search Deezer |
| POST | `/api/favorites/add` | ✅ | Add favorite song |
| DELETE | `/api/favorites/remove/:id` | ✅ | Remove favorite |
| GET | `/api/favorites` | ✅ | Get all favorites |

---

## 🎨 Mood → Music Mapping

| Mood | Genre / Search Query |
|------|---------------------|
| 😊 Happy | Pop hits, upbeat |
| 😢 Sad | Acoustic, melancholy |
| 😌 Relaxed | Chill, ambient, lofi |
| 💪 Energetic | Workout, gym, pump up |
| ❤️ Romantic | Love songs, ballad |
| 😡 Angry | Rock, metal, hard |
| 🔥 Motivated | Inspirational, anthem |
| 🎉 Party | Dance, EDM, club |

---

## 🤖 AI Mood Detection

MoodTune uses **Hugging Face's emotion-english-distilroberta-base** model to classify emotions from text:

- If the API key is configured → Uses real AI detection
- If API is unavailable or key is missing → Falls back to keyword-based matching

**Emotion mapping:**
```
joy → happy | love → romantic | sadness → sad
anger → angry | fear → sad | surprise → energetic
neutral → relaxed
```

---

## 🔒 Security Features

- ✅ JWT tokens with 7-day expiry
- ✅ bcrypt password hashing (salt rounds: 12)
- ✅ Rate limiting (100 req/15min, 10 auth req/15min)
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Passwords never returned in API responses
- ✅ Unique compound index prevents duplicate favorites

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Desktop (>992px) | Sidebar + main content |
| Tablet (768-992px) | Narrower sidebar |
| Mobile (<768px) | Bottom navigation bar |

---

## 🐛 Troubleshooting

**"Failed to fetch music"**
- Make sure backend is running on port 5000
- Check that CORS `FRONTEND_URL` matches your frontend origin

**"Invalid token"**
- Clear localStorage and log in again
- Verify `JWT_SECRET` is set in backend `.env`

**"MongoDB connection error"**
- Check `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas Network Access

**HuggingFace API not working**
- The app uses keyword fallback automatically
- For AI detection: get a free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

**Built with ❤️ using free APIs and free hosting. Happy listening! 🎵**

# 🎵 Musify — Backend

Express.js REST API for Musify music streaming app, deployed on Render.

![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![JWT](https://img.shields.io/badge/Auth-JWT-orange) ![Render](https://img.shields.io/badge/Deployed-Render-blue)

## 🌐 Live

https://musify-app-backend.onrender.com

---

## ✨ Features

- 🔐 JWT Bearer token authentication
- 👤 Role-based access (User / Artist)
- 🎵 Music upload via ImageKit
- 💿 Album creation and management
- 🛡️ Protected routes with middleware

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File handling |
| ImageKit | Audio storage |
| CORS | Cross-origin requests |

---

## 🚀 Getting Started

### Install

```bash
npm install
```

### Environment Variables

Create `.env` in the root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

```

### Run

```bash
npm start
```

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── auth.controller.js     # register, login, logout
│   └── music.controller.js    # upload, getAll, getAlbums, etc.
├── middlewares/
│   └── auth.middleware.js     # authUser, authArtist, authAny
├── models/
│   ├── user.model.js
│   ├── music.model.js
│   └── album.model.js
├── routes/
│   ├── auth.routes.js
│   └── music.routes.js
└── services/
    └── storage.service.js     # ImageKit upload
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user/artist |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Public | Logout |

### Music
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/music/` | User only | Get all music |
| POST | `/api/music/upload` | Artist only | Upload track |
| GET | `/api/music/my-music` | Artist only | Get artist's tracks |
| POST | `/api/music/album` | Artist only | Create album |
| GET | `/api/music/albums` | Any auth | Get all albums |
| GET | `/api/music/albums/:id` | Any auth | Get album by ID |

---

## 🔐 Authentication

All protected routes require Bearer token in header:

```
Authorization: Bearer <token>
```

Token is returned on login/register and stored in localStorage on frontend.

---

## 👨‍💻 Author

**Farrukh Gul**

---

## 📄 License

MIT

# Spotify Backend API Documentation

This document provides an overview of the backend project and its API endpoints. It's intended to help frontend developers understand how to interact with the server, including authentication, routes, and expected requests/responses.

---

## 🚀 Project Overview

- **Server:** Express.js application running on `port 3000` by default.
- **Database:** MongoDB (Mongoose is used for object modeling). Connection established in `src/db/db.js`.
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies.
- **Roles:** `user` and `artist`. Different permissions apply based on role.
- **File Storage:** ImageKit service used for uploading music files (base64 encoded).

---

## ⚙️ Setup Instructions (Backend)

1. **Clone the repository** and navigate to the backend directory:
   ```bash
   cd spotify-project/backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment variables:** create a `.env` file with the following keys:
   ```env
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PUBLIC_KEY=...
   IMAGEKIT_PRIVATE_KEY=...
   IMAGEKIT_URL_ENDPOINT=...
   ```
4. **Start the server:**
   ```bash
   npm start
   ```
   The server listens on `http://localhost:3000`.

> ⚠️ The frontend will need to run on a different port (e.g. `5173` for Vite) and should proxy API calls to port `3000` or use CORS/swapping.

---

## 🔐 Authentication

- **Registration:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Logout:** `POST /api/auth/logout`

### Request Format
All authentication requests expect a JSON body.

#### Register & Login
```json
{
  "username": "string",
  "email": "string",       // optional for login, required for register
  "password": "string",
  "role": "user"          // for register only, default is 'user'
}
```

### Responses
- Successful register/login returns `200` with `user` object and sets a `token` cookie.
- Failure responses include status codes `401`, `403`, or `409` with an error message.

> 🔒 The JWT token is stored in a cookie named `token` (HTTP-only). Frontend should include credentials in fetch requests: `fetch(url, { credentials: 'include' })`.

---

## 🎵 Music Endpoints

### Upload Music (Artist only)
`POST /api/music/upload`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
  - `music` file field (binary data)
  - `title` field (string)
- **Auth:** must be logged in as role `artist`.
- **Response:** `201` with newly created music metadata.

### Create Album (Artist only)
`POST /api/music/album`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Album Title",
    "musics": ["musicId1", "musicId2"]
  }
  ```
- **Auth:** artist role required.
- **Response:** `201` with album details.

### Get All Musics (User only)
`GET /api/music/`
- **Auth:** role `user` required.
- **Response:** `200` with array of music documents, populated with artist info.

### Get All Albums (User only)
`GET /api/music/albums`
- **Auth:** role `user` required.
- **Response:** `200` with albums summary.

### Get Album By ID (User only)
`GET /api/music/albums/:id`
- **Auth:** role `user` required.
- **Response:** `200` with full album details and populated musics.


---

## 👥 Data Models

### User
```js
{
  _id,
  username: String,
  email: String,
  password: String (hashed),
  role: 'user' | 'artist'
}
```

### Music
```js
{
  _id,
  uri: String,    // Link returned from ImageKit
  title: String,
  artist: ObjectId -> User
}
```

### Album
```js
{
  _id,
  title: String,
  musics: [ObjectId -> Music],
  artist: ObjectId -> User
}
```

---

## 📡 Frontend Integration Tips

- Always send `credentials: 'include'` with fetch/axios requests to carry cookies.
- Check `role` from login response to determine available UI options (upload vs browse).
- Use `/api/auth/logout` to clear the cookie during logout.
- Music files are uploaded as base64 to ImageKit; the backend returns a `uri` to stream/play.
- When handling albums, fetch `/api/music/albums/:id` to get both album metadata and music list.

---

Good luck building your frontend! If you need additional endpoints or clarifications, feel free to ask.
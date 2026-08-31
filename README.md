# ClickPlix

> **Capture once. Recognize your people. Share automatically.**

ClickPlix is a smart photo-sharing platform that uses **face recognition** to identify registered members in group photos and automatically deliver the photo to the matched people through **Telegram**.

Instead of manually sending photos to everyone after a group event, ClickPlix allows users to create groups, register their faces, capture a photo, and let the system determine who appears in the image.

---

## ✨ Features

### 🔐 User Authentication

* User registration with:

  * Name
  * Email
  * Password
  * Front-face image
  * Left-face image
  * Right-face image
* Secure password hashing
* JWT-based authentication
* Protected API endpoints
* Login/logout session management through JWT

### 👤 Face Registration

During registration, users provide three face images:

* Front-facing
* Left-facing
* Right-facing

ClickPlix uses **InsightFace** to generate face embeddings from these images.

These embeddings are stored in PostgreSQL and later used for face matching.

### 👥 Groups

Users can:

* Create groups
* View their groups
* Open individual groups
* Add members using ClickPlix registration codes
* View group members

Example:

```text
Friends
├── Anshuman
├── Rahul
├── Aman
└── Priya
```

### 📷 Smart Camera

Inside a group, users can:

1. Start their camera
2. Capture a photo
3. Send the photo for recognition
4. See which group members were detected

The frontend uses the browser's camera API:

```text
navigator.mediaDevices.getUserMedia()
```

### 🧠 Face Recognition

ClickPlix uses **InsightFace** for face detection and face embedding generation.

The system:

```text
Captured Photo
      ↓
Face Detection
      ↓
Face Embedding
      ↓
Compare with Registered Faces
      ↓
Similarity Score
      ↓
Matching Group Members
```

### 📱 Telegram Integration

Users can connect their Telegram account using a registration code.

Once connected, ClickPlix can send recognized photos directly to the user's Telegram account.

The connection is associated with the user's Telegram ID.

### 📊 Recognition Results

After processing a photo, ClickPlix displays:

* Detected group members
* User name
* Similarity score
* Telegram delivery status

Example:

```text
👤 Anshuman

Similarity: 91.42%

✅ Photo sent to Telegram
```

---

# 🏗️ Architecture

ClickPlix consists of three primary components:

```text
                    ┌────────────────────┐
                    │      Browser       │
                    │   React / Vite     │
                    └─────────┬──────────┘
                              │
                         HTTP / HTTPS
                              │
                              ▼
                    ┌────────────────────┐
                    │      FastAPI       │
                    │      Backend       │
                    └─────────┬──────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
       ┌────────────┐  ┌──────────────┐  ┌────────────┐
       │ PostgreSQL │  │  InsightFace │  │  Telegram  │
       │  Database  │  │ Face Model   │  │    Bot     │
       └────────────┘  └──────────────┘  └────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* JavaScript
* Browser MediaDevices API

## Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* JWT Authentication

## Database

* PostgreSQL

Current face embeddings are stored using PostgreSQL array fields.

## Face Recognition

* InsightFace
* OpenCV
* NumPy
* ONNX Runtime

## Messaging

* Telegram Bot API

---

# 📁 Project Structure

A simplified version of the project structure is:

```text
ClickPlix/
│
├── backend/
│   │
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── auth.py
│   ├── bot.py
│   │
│   ├── uploads/
│   │
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── Group.jsx
│   │   │   └── Camera.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

> The exact structure may differ depending on how the backend files are currently organized.

---

# 🔄 Application Flow

## 1. Registration

A new user creates an account.

```text
Name
Email
Password
   +
Front Face
Left Face
Right Face
        ↓
     FastAPI
        ↓
Face Detection
        ↓
Face Embeddings
        ↓
   PostgreSQL
```

Three face images are used to improve recognition across different face angles.

---

## 2. Login

The user provides:

```text
Email
Password
```

FastAPI verifies the credentials and returns a JWT access token.

The frontend stores the token locally:

```text
localStorage
    │
    └── access_token
```

Axios automatically attaches the token to authenticated API requests:

```http
Authorization: Bearer <token>
```

---

## 3. Telegram Connection

After registration, the system generates a registration code.

The user sends the code to the ClickPlix Telegram bot.

The backend associates the Telegram account with the ClickPlix user:

```text
Registration Code
       ↓
Telegram Bot
       ↓
Registration Token
       ↓
ClickPlix User
       ↓
telegram_id
```

The `/me` endpoint exposes the connection status:

```json
{
  "telegram_connected": true
}
```

---

## 4. Create a Group

An authenticated user creates a group.

For example:

```text
Friends
```

The creator can then add other registered ClickPlix users.

Members are added using their registration codes.

---

## 5. Capture a Photo

Inside a group:

```text
Start Camera
      ↓
Browser Camera
      ↓
Take Photo
      ↓
Captured Image
```

The captured image is converted into a JPEG blob and uploaded to the backend.

---

## 6. Face Recognition

FastAPI receives the image.

InsightFace detects faces and generates embeddings.

The embeddings are compared against registered face embeddings belonging to the group.

Conceptually:

```text
Photo
 │
 ├── Face 1 → Embedding
 ├── Face 2 → Embedding
 └── Face 3 → Embedding
             │
             ▼
      Compare with group
      member embeddings
             │
             ▼
       Similarity score
             │
             ▼
        Match / No Match
```

---

## 7. Telegram Delivery

When a group member is recognized:

```text
Recognized User
       ↓
Telegram ID
       ↓
Telegram Bot
       ↓
Photo Delivered
```

The frontend displays the recognition result to the person who captured the photo.

---

# 🗄️ Database Design

The project currently uses PostgreSQL.

The main entities include:

### User

Stores user information.

```text
User
├── id
├── name
├── email
├── password
└── telegram_id
```

### FaceImage

Stores registered face images and their embeddings.

```text
FaceImage
├── id
├── user_id
├── image_path
└── embedding
```

### RegistrationToken

Used for connecting users and Telegram accounts and for adding members to groups.

```text
RegistrationToken
├── id
├── code
├── user_id
├── telegram_id
├── expires_at
└── used
```

### Groups

Groups contain an owner and members.

The exact relationship structure is implemented through SQLAlchemy models.

---

# 🔑 Environment Variables

Create a `.env` file for the backend.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/clickplix

SECRET_KEY=your-secret-key

ALGORITHM=HS256

BOT_TOKEN=your-telegram-bot-token
```

For the React frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production, this should point to your deployed API:

```env
VITE_API_URL=https://api.yourdomain.com
```

### ⚠️ Important

Never commit your `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
```

Also never expose:

* JWT secret keys
* Database credentials
* Telegram bot tokens

in frontend code.

---

# 🚀 Local Development

## Prerequisites

Install the following:

* Python 3.10+
* Node.js
* PostgreSQL
* Git
* A Telegram account

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your `.env` file.

Then start FastAPI:

```bash
uvicorn main:app --reload
```

The API should be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

---

# 📡 API Overview

The backend currently exposes endpoints for the major ClickPlix operations.

### Authentication

```http
POST /users
POST /login
GET /me
```

### Groups

```http
GET /groups
POST /groups

GET /groups/{group_id}

POST /groups/{group_id}/members
```

### Photo Recognition

```http
POST /groups/{group_id}/click
```

The exact request and response structures can be viewed through FastAPI's Swagger documentation:

```text
/docs
```

---

# 🔐 Authentication Flow

ClickPlix uses JWT authentication.

```text
Login
  ↓
FastAPI verifies credentials
  ↓
JWT generated
  ↓
Frontend stores access token
  ↓
Axios interceptor attaches token
  ↓
Protected API request
  ↓
FastAPI validates JWT
  ↓
Current user identified
```

Axios automatically adds:

```http
Authorization: Bearer <access_token>
```

to authenticated requests.

---

# 🧠 Face Recognition Strategy

ClickPlix uses face embeddings instead of storing only raw face images for recognition.

The recognition process is based on similarity between embeddings.

Conceptually:

```text
Registered Face
      ↓
Embedding A

Captured Face
      ↓
Embedding B

Embedding A
      +
Embedding B
      ↓
Cosine Similarity
      ↓
Match decision
```

A similarity threshold is used to determine whether two embeddings represent the same person.

The threshold can be adjusted based on testing and recognition accuracy.

---

# ⚡ Performance Considerations

ClickPlix performs computationally heavier operations than a typical CRUD application because face recognition is involved.

Important optimization areas include:

### Model Initialization

InsightFace should be initialized once instead of loading the model for every request.

### Image Resizing

Large camera images should be resized before uploading.

For example:

```text
4032 × 3024
      ↓
1280 × 720
```

This reduces:

* Upload time
* Memory usage
* Processing time

### Background Telegram Processing

Telegram delivery can be moved into background processing so users don't have to wait for Telegram's API response.

### Vector Search

The current implementation can compare embeddings directly, but as the number of users grows, a vector index such as PostgreSQL + `pgvector` can be considered.

---

# 🔒 Security Considerations

Before production deployment, make sure to:

* Use HTTPS
* Store secrets in environment variables
* Use a strong JWT secret
* Never expose the Telegram bot token
* Never expose database credentials
* Validate uploaded files
* Restrict allowed image formats
* Limit upload sizes
* Configure CORS correctly
* Protect all authenticated endpoints
* Avoid committing `.env` files
* Use secure password hashing

---

# 🌐 Production Deployment

A possible production architecture is:

```text
                    ┌───────────────┐
                    │     Users     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ React / Vite  │
                    │   Frontend    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    FastAPI    │
                    │    Backend    │
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        PostgreSQL      InsightFace    Telegram
```

For a small deployment, a modest CPU server with sufficient RAM can handle the initial workload.

As usage increases, the backend can be scaled independently from the frontend.

---

# 📈 Future Improvements

Potential future improvements include:

* [ ] Better dashboard UI
* [ ] Responsive mobile UI
* [ ] Profile management
* [ ] Group invitation system
* [ ] Group photo history
* [ ] Photo gallery
* [ ] Automatic photo organization
* [ ] Background Telegram job queue
* [ ] Redis integration
* [ ] PostgreSQL `pgvector`
* [ ] Object storage for images
* [ ] Image compression
* [ ] Improved face matching
* [ ] Recognition confidence controls
* [ ] Rate limiting
* [ ] Production monitoring
* [ ] Automated tests
* [ ] Docker deployment
* [ ] CI/CD pipeline
* [ ] Custom domain
* [ ] HTTPS production deployment

---

# 🧪 Current Development Status

ClickPlix is currently under active development.

### Implemented

* ✅ React frontend
* ✅ FastAPI backend
* ✅ PostgreSQL database
* ✅ User registration
* ✅ JWT login
* ✅ Protected API requests
* ✅ Face registration
* ✅ InsightFace embeddings
* ✅ Group creation
* ✅ Group member management
* ✅ Browser camera capture
* ✅ Group face recognition
* ✅ Telegram account linking
* ✅ Telegram photo delivery

### In Progress

* 🚧 Production deployment
* 🚧 UI/UX improvements
* 🚧 Performance optimization
* 🚧 Scalable vector search
* 🚧 Background Telegram processing
* 🚧 Production image storage

---

# 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

```bash
git clone <repository-url>

cd ClickPlix
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add your feature"
```

Push the branch:

```bash
git push origin feature/your-feature
```

Then open a pull request.

---

# 📄 License

This project is currently being developed as a personal/academic project.

A formal open-source license can be added when the project is ready for public distribution.

---

# 👨‍💻 Project

**ClickPlix**

> Capture once. Recognize your people. Share automatically.

Built with:

**React • FastAPI • PostgreSQL • InsightFace • OpenCV • Telegram**


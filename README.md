# Vantage (formerly Pulse) - Video Streaming Platform

A detailed full-stack application for secure video uploading, processing, and streaming. Built with a focus on Role-Based Access Control (RBAC), real-time updates, and a premium user experience.

![Vantage Dashboard](https://via.placeholder.com/800x400?text=Vantage+Dashboard+Preview)

## 🚀 Features

### Core Functionality
- **Dual-Engine Streaming**: Secure HTTP Range Requests for smooth playback.
- **Real-Time Processing**: Socket.io integration to track video sensitivity analysis.
- **Multi-Tenant Architecture**: Users only manage their own content.
- **RBAC System**:
    - **Viewer**: Read-only access to the global library.
    - **Editor**: Upload, delete, and manage own videos.
    - **Admin**: Full system control (delete any video, view all).

### Premium UI/UX
- **Glassmorphic Design**: Modern, dark-themed UI with glass blur effects.
- **Cinematic Experience**: Hover-to-preview video cards and immersive featured section.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.

---

## 🛠 Tech Stack

**Backend**
- **Node.js & Express**: robust RESTful API.
- **MongoDB Atlas**: Cloud-native database for metadata and user storage.
- **Socket.io**: Real-time bidirectional communication.
- **JWT**: Secure stateless authentication.

**Frontend**
- **Vite + React**: Lightning-fast frontend build.
- **Tailwind CSS**: Utility-first styling for complex layouts.
- **Framer Motion**: Smooth, cinematic UI animations.
- **Axios**: Interceptors for automatic token management.

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/vantage.git
    cd vantage
    ```

2.  **Install Dependencies**
    ```bash
    # Install Server Deps
    cd server
    npm install

    # Install Client Deps
    cd ../client
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `/server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_super_secure_secret
    ```

4.  **Database Seeding (Optional)**
    Populate the DB with test users and videos:
    ```bash
    cd server
    node seed.js
    ```

5.  **Run the Application**
    **Development Mode (Concurrent)**:
    ```bash
    # Terminal 1 (Server)
    cd server
    npm run dev

    # Terminal 2 (Client)
    cd client
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

## 🔐 Demo Credentials

To make evaluation easy, the seeded users have been reset to a default password.

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `jay@33` | `12345678` | Full Control (Manage all videos) |
| **Editor** | `jay@12` | `12345678` | Upload & Manage Own Videos |
| **Viewer** | `jay@1` | `12345678` | Read-Only (Global Library) |

---

## 🧪 Testing

We included a basic integration test script to verify critical API flows (Auth & Upload).

1.  Ensure the server is running on port 5000.
2.  Run the test script:
    ```bash
    cd server
    node tests/basic.test.js
    ```

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Create new user (role: 'viewer' | 'editor').
- `POST /api/auth/login` - Authenticate and receive JWT.
- `GET /api/auth/me` - Get current user profile.

### Videos
- `GET /api/videos` - List videos (filtered by RBAC).
- `POST /api/videos/upload` - Multipart upload (Video file + Duration).
- `DELETE /api/videos/:id` - Delete video (Owner/Admin only).
- `GET /api/videos/stream/:id` - Stream video content.

---

## 💡 Design Decisions & Assumptions

1.  **Mocked Sensitivity Analysis**: 
    -   *Constraint*: Implementing a full AI content moderation model (like AWS Rekognition) or local FFmpeg analysis was outside the scope of a portable demo.
    -   *Solution*: We created a robust `ProcessingService` that **simulates** the asynchronous nature of this task. It emits real Socket.io events, updates database state ('pending' -> 'processing' -> 'safe/flagged'), and enables the frontend to show real-time progress bars. This proves the *architectural pattern* without the heavy dependency.

2.  **File Storage**:
    -   Videos are stored locally in `server/uploads` for simplicity. In a production environment, this `upload.js` middleware would be swapped for an S3/Cloudinary uploader.

3.  **RBAC Implementation**:
    -   middleware/auth.js handles strict permission checks.
    -   Frontend hides UI elements (Delete buttons, Upload forms) based on the user role to ensure a clean UX, but the backend remains the source of truth for security.

---

## 📂 Project Structure

```
vantage/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (VideoCard, Logo)
│   │   ├── context/        # Global State (Auth, Socket)
│   │   ├── pages/          # Views (Dashboard, Login, Player)
│   │   └── ...
│
└── server/                 # Express Backend
    ├── controllers/        # Request Logic
    ├── middleware/         # Auth & Upload Handling
    ├── models/             # Mongoose Schemas
    ├── routes/             # API Definitions
    ├── services/           # Business Logic (Processing)
    └── uploads/            # Video Storage
```

---

**Developed by Jayanth Thalla**

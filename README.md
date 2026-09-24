# VaultX — Zero-Trust Secure File Vault

> **"Your files. Encrypted before they leave your browser."**

VaultX is a high-security, zero-trust cloud file vault engineered to guarantee that plaintext files are encrypted locally inside the browser using **AES-256-GCM** before being transferred directly to private cloud storage (**AWS S3**).


---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Security Model](#security-model)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [MongoDB Setup](#mongodb-setup)
- [AWS S3 Setup](#aws-s3-setup)
- [Running Locally](#running-locally)
- [How to Use VaultX](#how-to-use-vaultx)
- [API Reference](#api-reference)
- [Security Practices](#security-practices)
- [Deployment](#deployment)
- [Production Configuration](#production-configuration)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [Demo for Judges](#demo-for-judges)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

In traditional cloud storage systems, user files are transmitted unencrypted over network boundaries to backend servers before being stored. This architecture exposes plaintext data to application server breaches, database leaks, internal operator threats, or cloud storage misconfigurations.

VaultX eliminates centralized plaintext exposure by executing all cryptographic transformations inside the user's web browser using the W3C standard **Web Crypto API**. Plaintext file bytes never reach the backend Express server during normal upload path operations. Encrypted ciphertexts are uploaded directly to private AWS S3 buckets using short-lived presigned URLs.

---

## Key Features

- **Client-Side AES-256-GCM Encryption:** Files are encrypted in browser memory before network transmission.
- **Per-File Key Isolation:** Unique randomly generated 256-bit Data Encryption Keys (DEKs) for every file.
- **PBKDF2-SHA-256 Key Derivation:** KEK key wrapping derived with 100,000 iterations and random salts.
- **Firebase Authentication:** Identity management with mandatory Firebase Email Verification.
- **HTTP-Only Session Cookies:** Session tokens stored exclusively in HTTP-only `vaultx_token` cookies.
- **Owner Authorization Scoping:** Strict `ownerId === req.user.id` database checks on all file operations.
- **Private AWS S3 Cloud Storage:** Short-lived presigned URLs for direct browser-to-S3 transfers.
- **Real-Time Security Audit Logging:** Detailed security event tracking (`LOGIN_SUCCESS`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `ACCESS_DENIED`) with automated secret redaction.
- **AES-GCM Tamper Detection:** 128-bit authentication tag verification and browser-memory tamper demo.
- **Security Center & Test Suite:** Interactive 12-point automated WebCrypto verification suite.

---

## Architecture

```text
User Device
  │
  ├─► React + Vite (Browser)
  │     └─► Web Crypto API (AES-256-GCM + PBKDF2)
  │
  ├─► Firebase Authentication (Identity & Email Link)
  │
  ├─► Node.js / Express API (Metadata & Authorization Router)
  │     └─► MongoDB Atlas (User & Metadata Persistence)
  │
  └─► AWS S3 Private Bucket (Direct Presigned Ciphertext Storage)
```

---

## Security Model

**"Encrypt first, then store."**

```text
Plaintext File
      │
      ▼
Browser (Web Crypto API) ──► AES-256-GCM Encryption
      │
  Ciphertext
      │
      ▼
AWS S3 Private Bucket (🔒 Encrypted Object)
```

1. **Client Boundary:** Plaintext bytes and encryption keys exist only in client RAM during file selection or decryption.
2. **Zero Backend Plaintext:** Node.js backend processes zero raw file bytes during uploads.
3. **Storage Boundary:** S3 receives and stores only encrypted ciphertext.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS | UI components and styling |
| **Icons & Motion** | Lucide React, Framer Motion | Icons and motion transitions |
| **Cryptography** | Web Crypto API | AES-256-GCM & PBKDF2 key derivation |
| **Authentication** | Firebase Authentication (v12) | User identity and email verification |
| **Backend** | Node.js, Express.js | Server runtime and REST API router |
| **Security** | Helmet, Cookie-Parser, Express-Rate-Limit | HTTP security headers & rate limiting |
| **Database** | MongoDB Atlas, Mongoose 8 | Metadata, user profiles, audit logs |
| **Cloud Storage** | AWS S3 (AWS SDK v3) | Presigned URL generation & encrypted objects |

---

## Project Structure

```text
CipherVault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── security/
│   │   │   │   ├── SecurityActivityTimeline.jsx
│   │   │   │   ├── TamperDemo.jsx
│   │   │   │   └── TrustBoundaryDiagram.jsx
│   │   │   ├── vault/
│   │   │   │   ├── DeleteFileModal.jsx
│   │   │   │   ├── EmptyVault.jsx
│   │   │   │   ├── FileCard.jsx
│   │   │   │   ├── FileGrid.jsx
│   │   │   │   ├── FileList.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── MetadataModal.jsx
│   │   │   │   ├── NoSearchResults.jsx
│   │   │   │   ├── UploadProgress.jsx
│   │   │   │   ├── VaultHeader.jsx
│   │   │   │   └── VaultStats.jsx
│   │   │   ├── CryptoTestSuite.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── crypto/
│   │   │   ├── aesGcm.js
│   │   │   ├── encoding.js
│   │   │   └── keyDerivation.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SecurityPage.jsx
│   │   │   └── VerifyEmailPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auditService.js
│   │   │   ├── authService.js
│   │   │   ├── cryptoService.js
│   │   │   └── fileService.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── index.js
│   │   │   └── s3.js
│   │   ├── controllers/
│   │   │   ├── auditController.js
│   │   │   ├── authController.js
│   │   │   ├── fileController.js
│   │   │   └── healthController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── AuditLog.js
│   │   │   ├── File.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── apiRoutes.js
│   │   │   ├── auditRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   └── fileRoutes.js
│   │   ├── services/
│   │   │   └── auditService.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── PROJECT_DOCUMENTATION.md
└── README.md
```

---

## Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git**
- **MongoDB Atlas Account**
- **Firebase Project Account**
- **AWS Account (S3 Access)**

---

## Installation

```bash
# Clone repository
git clone https://github.com/himanshuantal5640/CipherVault.git
cd CipherVault

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Environment Variables

### Frontend (`client/.env`)
```env
VITE_API_URL=https://client-rho-lemon.vercel.app

```

## Firebase Setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** under **Authentication → Sign-in method**.
3. Copy Web App config into `client/.env`.
4. Add `localhost` and your production domain to **Authorized Domains**.

---

## MongoDB Setup

1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a Database User with read/write access.
3. Add `0.0.0.0/0` under Network Access.
4. Copy the connection string into `MONGODB_URI` in `server/.env`.

---

## AWS S3 Setup

1. Create an S3 bucket in AWS Console.
2. Enable **Block All Public Access**.
3. Add CORS configuration under **Bucket Permissions**:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "https://YOUR_VERCEL_APP.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```
4. Create an IAM user with `AmazonS3FullAccess` policy and paste key/secret into `server/.env`.

---

## Running Locally

### Terminal 1 — Backend API Server:
```bash
cd server
npm run dev
```

### Terminal 2 — Frontend Application:
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## How to Use VaultX

### 1. Register & Verify Email
- Click **Get Started** on the navbar.
- Enter email and master password → Click **Register & Verify Email**.
- Check your email inbox and click the Firebase link.
- Return to `/verify-email` and click **Account Verified**.

### 2. Login
- Go to `/login`, enter your email and password, and click **Enter Vault Console**.

### 3. Upload File
- On `/dashboard`, drag & drop a file into the upload zone.
- The pipeline executes local WebCrypto encryption, requests presigned URL, and uploads ciphertext directly to S3.

### 4. Verify Encryption on S3
- Open AWS S3 Console → Open your bucket → Download the object.
- The file will open as unreadable raw binary ciphertext, confirming zero server plaintext storage.

### 5. Download & Decrypt File
- Click **Download** on any file card → Enter your master passphrase → Click **Download & Decrypt**.
- The file is downloaded from S3 and decrypted in your browser memory into the original file.

### 6. Delete File
- Click the **Trash** icon → Confirm deletion. The S3 object and MongoDB metadata will be removed.

### 7. Security Center & Tamper Demo
- Open `/security` → Click **Run Tamper Test** to observe how 1-byte ciphertext corruption triggers AES-GCM tag verification failure.

---

## API Reference

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | Public |
| `POST` | `/api/auth/register` | User registration | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/logout` | Clear session cookie | Protected |
| `GET` | `/api/auth/me` | Current user profile | Protected |
| `POST` | `/api/files/upload-url` | Request presigned PUT URL | Protected |
| `POST` | `/api/files` | Store encrypted metadata | Protected |
| `GET` | `/api/files` | List user files | Protected |
| `GET` | `/api/files/:id/download-url` | Request presigned GET URL | Protected |
| `DELETE` | `/api/files/:id` | Delete file object & metadata | Protected |
| `GET` | `/api/audit` | Fetch security audit logs | Protected |

---

## Security Practices

- **Zero Secrets in Git:** `.env` files are excluded in `.gitignore`.
- **Backend-Only Credentials:** AWS secret keys and Firebase service keys are never exposed in client bundles.
- **Owner Authorization:** Enforced on every database file query (`ownerId === req.user.id`).
- **HTTP-Only Cookies:** Prevents XSS token theft.

---

## Deployment

### Backend (Render)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Configure environment variables on Render.

### Frontend (Vercel)
- Root Directory: `client`
- Set `VITE_API_URL` to your live Render backend URL (`https://ciphervault-backend.onrender.com/api`).

---

## Production Configuration

- **Frontend Domain:** Vercel deployment URL
- **Backend Domain:** Render deployment URL
- **CORS Allowed Origins:** S3 CORS and Express CORS configured to match production Vercel domain.

---

## Testing Checklist

- [x] WebCrypto client encryption verified.
- [x] Plaintext files not sent to Express backend.
- [x] Firebase Email Verification flow verified.
- [x] HTTP-only `vaultx_token` cookies set securely.
- [x] Ownership authorization blocks cross-tenant access.
- [x] S3 bucket remains 100% private.
- [x] 1-byte corrupted ciphertext fails AES-GCM authentication.

---

## Troubleshooting

### CORS Error During S3 Upload
- Verify that your S3 bucket CORS permissions include your frontend origin URL (`http://localhost:5173` or Vercel URL).

### Firebase Login Mismatch
- Ensure `VITE_FIREBASE_*` environment variables in `client/.env` match your Firebase project settings.

### MongoDB Connection Failed
- Check MongoDB Atlas Network Access and ensure `0.0.0.0/0` is whitelisted.

---

## Demo for Judges (3-Minute Script)

1. **Overview (0:00 - 0:30):** Present Landing Page tagline and architecture diagram.
2. **Registration (0:30 - 1:00):** Create account and complete Firebase email verification.
3. **Upload & S3 Ciphertext Verification (1:00 - 1:45):** Upload a file. Show AWS S3 console storing raw ciphertext.
4. **Download & Decryption (1:45 - 2:15):** Click Download, enter passphrase, and show restored plaintext file.
5. **Security Center & Tamper Demo (2:15 - 3:00):** Run 1-byte tamper test and view audit activity.

---

## Limitations

- **Browser Dependency:** Encryption security relies on an uncompromised client browser.
- **Passphrase Recovery:** In a zero-knowledge model, losing your master passphrase makes files unrecoverable.

---

## Future Enhancements

- Multi-recipient end-to-end encrypted sharing via ECDH public keys.
- Hardware key (WebAuthn / YubiKey) protection.
- Chunked streaming for files over 1 GB.

---

## License

License: Not specified.

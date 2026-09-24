# VaultX — Zero-Trust Secure File Vault

> **"Your files. Your keys. Zero implicit trust."**

VaultX is a security-focused file storage platform designed around the principle of **Zero-Trust Client-Side Encryption**. In traditional cloud storage systems, providers hold or have access to encryption keys, creating potential data exposure vectors through server compromise, insider threats, or supply chain attacks. VaultX eliminates server-side exposure by encrypting files directly inside the browser using **AES-256-GCM** before any data leaves the client device, transferring ciphertext directly to AWS S3 using short-lived presigned URLs.

---

## 1. Problem Statement
Most cloud storage solutions follow a "Trust the Cloud Provider" model where server infrastructure receives unencrypted plaintext files, processes them, and manages encryption at rest. If the backend is breached, database credentials leak, or cloud permissions misconfigure, stored files are vulnerable to unauthorized access and exfiltration.

## 2. Project Objective
To construct a zero-knowledge, zero-trust cloud file vault where:
- The server **never** receives or stores unencrypted plaintext files or ciphertext file buffers.
- Encryption keys are derived client-side from user master passphrases via **PBKDF2-SHA-256** and never sent to the server.
- Each file receives an independent, cryptographically random **AES-256-GCM** symmetric key (DEK).
- The server acts strictly as an authenticated metadata directory and presigned URL generator for AWS S3.

---

## 3. Core Security Architecture

```text
       ┌────────────────────────┐
       │      User Browser      │
       └───────────┬────────────┘
                   │
                   ▼  (Plaintext File + Client Key Derivation)
       ┌────────────────────────┐
       │ Client-side AES-256-GCM│
       └───────────┬────────────┘
                   │
                   ├──► 1. POST /api/files/upload-url (Metadata Only) ──► Node.js / Express
                   │                                                         │
                   │    ◄── 2. Short-Lived S3 Presigned PUT URL ───────────────┘
                   │
                   ▼  (3. Direct Encrypted Ciphertext Upload)
       ┌────────────────────────┐
       │     AWS S3 Bucket      │
       └────────────────────────┘
```

> **Zero-Knowledge Guarantee:** The backend receives only encrypted metadata (salt, IVs, wrapped DEK) and user IDs. It is mathematically impossible for the backend or cloud provider to read user data without the client-side master key.

---

## 4. AWS S3 Setup & Configuration

### Environment Variables (`server/.env`)
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://...

JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI...
AWS_S3_BUCKET=vaultx-zero-trust-files
```

### Required IAM Policy (Least-Privilege)
Restrict backend IAM user permissions strictly to the target VaultX S3 bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VaultXS3ObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vaultx-zero-trust-files/*"
    }
  ]
}
```

### S3 Bucket CORS Configuration
Configure your S3 bucket CORS rules to permit direct browser uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### S3 Object Key Security Structure
Object keys are formatted using cryptographically random UUIDs within the user's isolated namespace:
`users/{ownerId}/{fileUUID}.enc`

Example: `users/6ab4e4a11fe7d46a0aab7e5e/c9a4b8d1-7e2f-410a-85bc-91d8e3b4a2c0.enc`

Original filenames are **never** used as S3 object keys.

---

## 5. Technology Stack

### Frontend (`/client`)
- **Framework:** React 18 (Vite)
- **Cryptography:** Web Crypto API (`window.crypto.subtle`)
- **Styling:** Tailwind CSS (Cybersecurity Dark Theme)
- **Icons & Motion:** Lucide React, Framer Motion
- **HTTP Client:** Axios & Fetch API for Direct S3 Transfers
- **Routing:** React Router v6

### Backend (`/server`)
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose (User & File Metadata)
- **Authentication:** JWT in HTTP-Only Cookies (`vaultx_token`)
- **Validation & Hashing:** Zod, bcryptjs
- **Cloud Storage SDK:** AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Security Middleware:** Helmet, Express Rate Limit, CORS, Cookie Parser

---

## 6. Local Setup & Execution

```bash
# Install all dependencies
npm run install:all

# Run backend server (http://localhost:5000)
npm run server

# Run frontend client (http://localhost:5173)
npm run client
```

---

## 7. Implementation Status & Roadmap

- [x] **Phase 1: Project Foundation** (Monorepo scaffolding, dark cyber UI shell, routing, health APIs)
- [x] **Phase 2: Authentication & MongoDB** (MongoDB models, bcrypt, JWT HTTP-only cookies, auth middleware, Zod)
- [x] **Phase 3: Client-Side WebCrypto Encryption** (AES-256-GCM, PBKDF2 100,000 iterations, DEK wrapping, IV separation, 12-point test suite)
- [x] **Phase 4: AWS S3 Encrypted Cloud Storage** (Direct browser-to-S3 transfers, presigned URLs, S3 object deletion, MongoDB file metadata, user namespace scoping)

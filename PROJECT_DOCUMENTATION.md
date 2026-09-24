# VaultX — Zero-Trust Secure File Vault
## Complete System Architecture, Security Specification & Technical Documentation

---

## Table of Contents
1. [Abstract](#1-abstract)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Objectives](#4-objectives)
5. [Scope](#5-scope)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Zero-Trust / Security Architecture](#8-zero-trust--security-architecture)
9. [Encryption Workflow](#9-encryption-workflow)
10. [Decryption Workflow](#10-decryption-workflow)
11. [Authentication Flow](#11-authentication-flow)
12. [Authorization and Ownership](#12-authorization-and-ownership)
13. [AWS S3 Architecture](#13-aws-s3-architecture)
14. [Database Design](#14-database-design)
15. [API Documentation](#15-api-documentation)
16. [Frontend Application Modules](#16-frontend-application-modules)
17. [Upload Process](#17-upload-process)
18. [Download Process](#18-download-process)
19. [Delete Process](#19-delete-process)
20. [Search and Filtering](#20-search-and-filtering)
21. [Audit Logging](#21-audit-logging)
22. [Tamper Detection](#22-tamper-detection)
23. [Security Controls](#23-security-controls)
24. [Threat Model](#24-threat-model)
25. [Error Handling](#25-error-handling)
26. [Environment Variables](#26-environment-variables)
27. [Installation and Setup](#27-installation-and-setup)
28. [Firebase Setup](#28-firebase-setup)
29. [MongoDB Atlas Setup](#29-mongodb-atlas-setup)
30. [AWS S3 Setup](#30-aws-s3-setup)
31. [Local Application Usage — STEP BY STEP](#31-local-application-usage--step-by-step)
32. [Production Deployment](#32-production-deployment)
33. [Deployment Architecture](#33-deployment-architecture)
34. [Testing](#34-testing)
35. [Security Testing Checklist](#35-security-testing-checklist)
36. [Limitations](#36-limitations)
37. [Future Enhancements](#37-future-enhancements)
38. [Conclusion](#38-conclusion)
39. [Demo Flow for Judges](#39-demo-flow-for-judges)

---

## 1. Abstract

**VaultX** is a high-security, zero-trust cloud file vault engineered to eliminate centralized plaintext file exposure. In traditional cloud storage systems, user files are uploaded unencrypted over network boundaries to backend servers, leaving plaintext file contents vulnerable to server breaches, internal operator threats, database leaks, or cloud storage misconfigurations.

VaultX fundamentally changes the trust boundary by moving all cryptographic file operations directly into the user's web browser using the native **Web Crypto API**. Before any file leaves the client device, it is encrypted locally using Galois/Counter Mode (**AES-256-GCM**) authenticated encryption with a unique, randomly generated 256-bit Data Encryption Key (DEK). The DEK itself is wrapped using a Key Encryption Key (KEK) derived via **PBKDF2-SHA-256** (100,000 iterations).

The **Node.js/Express backend** serves strictly as an authentication, authorization, metadata management, and presigned transfer coordinator. Raw plaintext file bytes are **never** transmitted to or processed by the Express backend server during normal upload operations. Encrypted ciphertext is transferred directly from the browser to a private **AWS S3 bucket** via short-lived presigned PUT URLs. User identity and email verification are managed through **Firebase Authentication**, while session authorization is maintained via secure **HTTP-Only JWT cookies**. All system activities are audited and stored in **MongoDB**.

---

## 2. Problem Statement

Conventional cloud file storage architectures require users to place absolute, unverified trust in application servers, cloud infrastructure, and administrative operators. This architecture introduces several critical security vulnerabilities:

1. **Server-Side Plaintext Exposure:** Traditional web applications receive raw file streams on backend servers prior to cloud storage, exposing sensitive documents to memory inspection, unauthorized logging, or application server compromises.
2. **Unauthorized Cross-Tenant Access:** Weak or missing ownership boundaries allow attackers to manipulate file parameters or object identifiers (IDOR / Resource Enumeration) to access other users' private files.
3. **Lack of Authenticated Ciphertext Tamper Detection:** Standard encryption algorithms without message authentication tags cannot detect bit-flipping or unauthorized ciphertext modification during transit or storage.
4. **Credential & Key Exposure Risks:** Storing unencrypted keys or user secrets in local storage (`localStorage`) exposes key material to Cross-Site Scripting (XSS) attacks.
5. **Inadequate Security Auditability:** Most cloud vaults lack user-accessible audit logs, leaving account holders unaware of unauthorized download attempts or security events.

VaultX directly addresses these threats by guaranteeing client-side authenticated encryption, zero backend plaintext handling, strict owner-scoped authorization, and comprehensive auditability.

---

## 3. Proposed Solution

VaultX implements a strict zero-trust security paradigm:

- **Browser-Side AES-256-GCM Encryption:** All cryptographic file transformations execute inside the user's browser RAM using W3C standard Web Crypto API (`window.crypto.subtle`).
- **Two-Level Key Hierarchy:**
  - **DEK (Data Encryption Key):** A fresh 256-bit AES-GCM key generated per file using cryptographically secure random values (`crypto.getRandomValues`).
  - **KEK (Key Encryption Key):** Derived from the user's master passphrase using PBKDF2-HMAC-SHA-256 with 100,000 iterations and a unique 128-bit salt.
- **Key Wrapping & Nonce Separation:** The DEK is encrypted (wrapped) with the KEK using AES-256-GCM. Independent 96-bit Initialization Vectors (IVs) are generated for the DEK wrapper (`wrapIV`) and the file payload (`fileIV`).
- **Direct S3 Presigned Transfers:** The browser uploads encrypted ciphertext directly to AWS S3 using short-lived S3 presigned PUT URLs generated by the backend.
- **Private S3 Storage & Namespace Scope:** The S3 bucket remains strictly private with AWS Block Public Access enabled. Object keys follow a user-isolated namespace: `users/{ownerId}/{uuid}.enc`.
- **Backend Authorization Boundary:** Every file API endpoint verifies that `ownerId === req.user.id`. Requests for non-owned files return HTTP 404 to prevent resource enumeration.
- **Firebase & HTTP-Only Cookie Authentication:** Firebase Authentication manages email/password identities and email verification, while the Node.js backend issues HTTP-only `vaultx_token` JWT cookies to prevent XSS token theft.
- **Audit Logging & Tamper Detection:** Real-time event tracking logs security actions (`LOGIN_SUCCESS`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `ACCESS_DENIED`), while AES-GCM 128-bit authentication tags reject tampered ciphertexts.

---

## 4. Objectives

- **Client-Side Plaintext Protection:** Guarantee that zero plaintext file bytes are sent to or stored on the backend Express server during normal file upload operations.
- **Strong Cryptographic Confidentiality & Integrity:** Implement AES-256-GCM authenticated encryption with PBKDF2 key derivation and unique per-file DEKs.
- **Secure Identity & Session Management:** Require Firebase email verification and issue secure HTTP-only cookies.
- **Strict Owner Authorization:** Scope all file metadata queries and S3 URL generation to the authenticated user ID (`ownerId === req.user.id`).
- **Direct Cloud Transfer:** Use short-lived AWS S3 presigned URLs for direct browser-to-S3 ciphertext upload and download.
- **Verifiable Auditability:** Provide an interactive Security Center with user audit logs and browser-memory tamper detection testing.

---

## 5. Scope

### Included (Implemented Functionality)
- Web Crypto API AES-256-GCM client-side encryption and decryption.
- PBKDF2-SHA-256 key derivation (100,000 iterations) and AES-GCM DEK wrapping.
- Firebase Authentication with registration, email verification, login, and resend verification link flow.
- Node.js/Express REST backend with HTTP-only JWT cookie session management (`vaultx_token`).
- MongoDB Atlas metadata persistence with offline/in-memory fallback support.
- AWS S3 presigned URL generation (PUT and GET) with user-isolated object keys.
- Vault Dashboard with client-side search filtering by `originalName`, `mimeType`, and `s3Key`.
- Security Center with Trust Boundary diagrams, 12-point WebCrypto test suite, real audit event timeline, and interactive 1-byte tamper detection demonstration.
- Production hosting configuration for Vercel (Frontend) and Render (Backend).

### Not Included / Future Scope
- End-to-end multi-user encrypted file sharing with public key cryptography (RSA/ECDH).
- Multi-device automated key synchronization or hardware security key (FIDO2/WebAuthn) support.
- Automated cloud backup replication across multi-region S3 buckets.
- Chunked streaming encryption for files exceeding 100 MB.

---

## 6. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 | User interface components and state management |
| **Build Tool** | Vite 5 | Fast development server and production bundler |
| **Styling** | Tailwind CSS 3 | Modern dark-mode styling system and utility classes |
| **Icons & Animations** | Lucide React & Framer Motion | UI icons and smooth motion transitions |
| **Browser Cryptography** | Web Crypto API (`window.crypto.subtle`) | Client-side AES-256-GCM & PBKDF2 cryptography |
| **Authentication** | Firebase Authentication (v12) | Client identity and email verification |
| **Backend Runtime** | Node.js (v18+) | Server-side JavaScript execution environment |
| **API Framework** | Express.js 4 | REST API routing, CORS, and middleware handling |
| **Security Headers** | Helmet & Cookie-Parser | HTTP security headers and HTTP-only cookie parsing |
| **Rate Limiting** | Express-Rate-Limit | IP rate limiting for authentication and API routes |
| **Database** | MongoDB Atlas | Persistent metadata, user records, and audit logs |
| **ODM** | Mongoose 8 | Schema modeling and MongoDB query abstraction |
| **Cloud Storage** | AWS S3 (SDK v3) | Encrypted ciphertext object storage |
| **Cloud Authorization** | AWS S3 Presigned URLs | Short-lived browser-direct S3 transfer authorization |
| **Deployment** | Vercel & Render | Frontend hosting (Vercel) & Backend hosting (Render) |

---

## 7. System Architecture

```text
                               +-----------------------------+
                               |     USER / WEB BROWSER      |
                               +--------------+--------------+
                                              |
                        +---------------------+---------------------+
                        |                                           |
                        v                                           v
         +------------------------------+            +------------------------------+
         |     React / Vite Frontend    |            |    Firebase Authentication   |
         |  - User Interface            |            |  - Email/Password Auth       |
         |  - Vault Dashboard           |            |  - Email Verification Link   |
         |  - Security Center           |            +------------------------------+
         +--------------+---------------+
                        |
                        v
         +------------------------------+
         |       Web Crypto API         |
         |  - PBKDF2-SHA-256 (100k)     |
         |  - DEK Generation (256-bit)  |
         |  - AES-256-GCM Encryption    |
         +--------------+---------------+
                        |
                        | (Encrypted Ciphertext Only)
                        v
         +------------------------------+            +------------------------------+
         |   Node.js / Express Backend  | <--------> |        MongoDB Atlas         |
         |  - Presigned URL Generator   |            |  - User Profiles             |
         |  - Ownership Authorization   |            |  - File Metadata & DEKs      |
         |  - Audit Logger              |            |  - Security Audit Logs       |
         +--------------+---------------+            +------------------------------+
                        |
                        | (Presigned S3 PUT/GET Transfer)
                        v
         +------------------------------+
         |    AWS S3 Private Bucket     |
         |  - Object: users/{id}/{uuid} |
         |  - Block Public Access       |
         +------------------------------+
```

---

## 8. Zero-Trust / Security Architecture

VaultX operates under a strict zero-trust security architecture where no component inherently trusts another:

1. **Client-Side Encryption Boundary:** The application server and cloud storage are treated as untrusted transport/storage layers. Plaintext contents exist exclusively in client RAM during file selection or decryption.
2. **Presigned URL Isolation:** Direct browser S3 transfers use short-lived presigned URLs generated on demand. The Express backend validates session state before emitting a signed URL.
3. **Owner Authorization Scoping:** Database lookups for file retrieval or deletion strictly enforce `ownerId === req.user.id`. Attempting to access an unauthorized file returns HTTP 404.
4. **Token Security:** Authentication tokens (`vaultx_token`) are delivered via HTTP-Only, `SameSite=Strict/Lax` (or `SameSite=None` cross-domain) cookies with `Secure` flags, preventing token access via JavaScript XSS.
5. **No Key Storage in LocalStorage:** Raw encryption keys (DEK/KEK) are never stored in `localStorage` or `sessionStorage`. Keys are derived in RAM on demand when the user provides their passphrase.

---

## 9. Encryption Workflow

```text
[User File] -> [Read ArrayBuffer] -> [Generate 256-bit DEK] -> [AES-256-GCM Encrypt File] 
                                                                        |
[Master Passphrase + Salt] -> [PBKDF2-SHA-256 KEK] -> [Wrap DEK] -> [Ciphertext Package]
                                                                        |
[POST /api/files/upload-url] -> [S3 Presigned PUT] -> [Direct Upload to S3] -> [Save Metadata in MongoDB]
```

### Detailed Sequence:
1. **File Selection:** User selects a file in the browser.
2. **DEK Generation:** Browser calls `window.crypto.subtle.generateKey` to create a fresh 256-bit AES-GCM DEK.
3. **Payload Encryption:** File bytes are encrypted with `window.crypto.subtle.encrypt` using a 96-bit random `fileIV`.
4. **KEK Derivation:** Master passphrase and a random 128-bit salt are passed to `window.crypto.subtle.deriveKey` using PBKDF2-HMAC-SHA-256 (100,000 iterations).
5. **DEK Wrapping:** The DEK is exported and encrypted with the KEK using a 96-bit `wrapIV`.
6. **Presigned URL Request:** Frontend sends file metadata (original name, size, mimeType) to `POST /api/files/upload-url`.
7. **Direct S3 Upload:** Frontend executes a `PUT` fetch directly to AWS S3 using the presigned URL with the encrypted ciphertext body.
8. **Metadata Storage:** Frontend posts the non-secret metadata package (`originalName`, `s3Key`, `size`, `mimeType`, `encryptedDEK`, `fileIV`, `wrapIV`, `salt`, `algorithm`, `keyDerivation`) to `POST /api/files`.

---

## 10. Decryption Workflow

```text
[User Requests Download] -> [GET /api/files/:id/download-url] -> [Backend Authorizes ownerId]
                                                                          |
[Receive Presigned GET URL + Metadata] -> [Fetch Ciphertext from S3] -> [Derive KEK via PBKDF2]
                                                                          |
[Unwrap DEK with KEK + wrapIV] -> [Decrypt Ciphertext with DEK + fileIV] -> [Download Recovered File]
```

### Detailed Sequence:
1. **Download Trigger:** User clicks Download on a vault file card.
2. **Authorization & URL Request:** Frontend sends request to `GET /api/files/:id/download-url`.
3. **Backend Scoped Lookup:** Express server queries `File.findOne({ _id: fileId, ownerId: req.user.id })`.
4. **Presigned URL & Metadata Returned:** Backend returns a short-lived presigned GET URL and the stored metadata package.
5. **Ciphertext Download:** Frontend fetches raw ArrayBuffer ciphertext directly from S3.
6. **KEK Derivation:** User's passphrase and stored `salt` derive the KEK via PBKDF2.
7. **DEK Unwrapping:** The stored `encryptedDEK` is decrypted using the KEK and `wrapIV`.
8. **Payload Decryption:** Ciphertext ArrayBuffer is decrypted with the unwrapped DEK and `fileIV`. AES-GCM verifies the 128-bit authentication tag.
9. **Blob Reconstruction:** Decrypted ArrayBuffer is converted into a browser Blob and triggered for local download.

---

## 11. Authentication Flow

```text
[User Register / Login] -> [Firebase Client SDK Auth] -> [Firebase Email Verification]
                                                                   |
[POST /api/auth/register or /login] -> [Express Backend Creates/Validates User Record]
                                                                   |
[Backend Issues JWT] -> [Set-Cookie: vaultx_token (HTTP-Only)] -> [Authenticated Session]
```

1. **Client Identity:** Users register and authenticate via Firebase Authentication on the frontend.
2. **Email Verification:** Registration dispatches a verification link via Firebase. Users verify their email before completing activation.
3. **Backend Session Exchange:** Frontend calls `POST /api/auth/register` or `/login`. Backend creates/validates the MongoDB `User` model (`email`, `passwordHash` hashed with bcrypt cost 12).
4. **HTTP-Only Cookie:** Backend signs a JWT (`sub: userId`) and sets an HTTP-only `vaultx_token` cookie.
5. **Session Validation:** Subsequent requests pass through `protect` middleware, which decodes `vaultx_token` and populates `req.user`.

---

## 12. Authorization and Ownership

File authorization is enforced at the database query boundary:

```javascript
// Scoped ownership check in fileController.js
const fileRecord = await File.findOne({
  _id: fileId,
  ownerId: req.user.id
});

if (!fileRecord) {
  return res.status(404).json({
    success: false,
    message: 'File not found or access denied.'
  });
}
```

- **Cross-Tenant Isolation:** User A cannot view metadata, request presigned URLs, or delete files belonging to User B.
- **IDOR / Resource Enumeration Protection:** Mismatched owner queries return HTTP 404 instead of 403, preventing attackers from probing for valid file IDs.
- **S3 Key Isolation:** Uploaded S3 keys follow `users/{ownerId}/{uuid}.enc`. The backend verifies `s3Key.startsWith('users/' + req.user.id + '/')` before storing metadata.

---

## 13. AWS S3 Architecture

- **Bucket Policy:** Private bucket with **Block All Public Access** enabled.
- **Access Authorization:** IAM credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) remain backend-only.
- **Object Key Structure:** `users/{ownerId}/{crypto.randomUUID()}.enc`
- **Presigned PUT URL Expiration:** 900 seconds (15 minutes).
- **Presigned GET URL Expiration:** 900 seconds (15 minutes).
- **CORS Policy:** Restricts allowed origins to the authorized client application URL (`CLIENT_URL` / `http://localhost:5173`).

---

## 14. Database Design

### Collection: `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `email` | String | User email (Unique, indexed, lowercase) |
| `passwordHash` | String | Bcrypt hashed password (cost 12) |
| `createdAt` | Date | Timestamp |
| `updatedAt` | Date | Timestamp |

### Collection: `files`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `ownerId` | ObjectId (ref User) | Owner reference (Indexed) |
| `originalName` | String | Original filename |
| `s3Key` | String | AWS S3 object key (Unique) |
| `size` | Number | File size in bytes |
| `mimeType` | String | MIME content type |
| `encryptedDEK` | String | Base64 encoded encrypted DEK |
| `fileIV` | String | Base64 encoded file IV (96-bit) |
| `wrapIV` | String | Base64 encoded DEK wrap IV (96-bit) |
| `salt` | String | Base64 encoded PBKDF2 salt (128-bit) |
| `algorithm` | String | Default `AES-256-GCM` |
| `keyDerivation` | Object | `{ algorithm: 'PBKDF2-SHA-256', iterations: 100000 }` |
| `createdAt` | Date | Timestamp |

### Collection: `auditlogs`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `userId` | ObjectId (ref User) | User reference (Indexed) |
| `action` | String | Enum: `LOGIN_SUCCESS`, `LOGIN_FAILED`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `FILE_DELETE`, `ACCESS_DENIED` |
| `fileId` | String | Related file ID (optional) |
| `status` | String | Enum: `SUCCESS`, `FAILED`, `BLOCKED` |
| `ipAddress` | String | Request IP address |
| `userAgent` | String | Request User-Agent |
| `details` | Object | Sanitized details object |
| `createdAt` | Date | Timestamp (Indexed compound `{ userId: 1, createdAt: -1 }`) |

---

## 15. API Documentation

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Authentication:** Not Required
- **Response:**
```json
{
  "success": true,
  "status": "HEALTHY",
  "environment": "development",
  "timestamp": "2026-09-24T18:00:00.000Z",
  "services": {
    "database": "CONNECTED",
    "storage": "S3_CONFIGURED"
  }
}
```

### 2. User Registration
- **Endpoint:** `POST /api/auth/register`
- **Authentication:** Not Required (Rate limited)
- **Request Body:**
```json
{
  "email": "user@vaultx.io",
  "password": "MasterPassword123!"
}
```
- **Response:** `HTTP 201 Created` with `Set-Cookie: vaultx_token=...`

### 3. User Login
- **Endpoint:** `POST /api/auth/login`
- **Authentication:** Not Required (Rate limited)
- **Request Body:**
```json
{
  "email": "user@vaultx.io",
  "password": "MasterPassword123!"
}
```
- **Response:** `HTTP 200 OK` with `Set-Cookie: vaultx_token=...`

### 4. Current User Session
- **Endpoint:** `GET /api/auth/me`
- **Authentication:** Required (`vaultx_token` cookie)
- **Response:**
```json
{
  "success": true,
  "user": {
    "id": "66f2a1b2c3d4e5f678901234",
    "email": "user@vaultx.io"
  }
}
```

### 5. Logout
- **Endpoint:** `POST /api/auth/logout`
- **Authentication:** Required
- **Response:** Clears `vaultx_token` cookie.

### 6. Request Presigned Upload URL
- **Endpoint:** `POST /api/files/upload-url`
- **Authentication:** Required
- **Request Body:**
```json
{
  "fileName": "contract.pdf",
  "fileSize": 1048576,
  "mimeType": "application/pdf"
}
```
- **Response:**
```json
{
  "success": true,
  "uploadUrl": "https://ciphervault-bucket.s3.ap-south-1.amazonaws.com/users/...",
  "s3Key": "users/66f2a1b2c3d4e5f678901234/a1b2c3d4-4321-4321-4321-a1b2c3d4e5f6.enc",
  "fileId": "a1b2c3d4-4321-4321-4321-a1b2c3d4e5f6"
}
```

### 7. Save File Metadata
- **Endpoint:** `POST /api/files`
- **Authentication:** Required
- **Request Body:** Cryptographic metadata package.
- **Response:** `HTTP 201 Created`

### 8. Get File List
- **Endpoint:** `GET /api/files`
- **Authentication:** Required
- **Response:** Array of user's file metadata objects.

### 9. Request Presigned Download URL
- **Endpoint:** `GET /api/files/:id/download-url`
- **Authentication:** Required
- **Response:** Presigned GET URL & cryptographic metadata.

### 10. Delete File
- **Endpoint:** `DELETE /api/files/:id`
- **Authentication:** Required
- **Response:** `HTTP 200 OK`

### 11. Get Audit Logs
- **Endpoint:** `GET /api/audit`
- **Authentication:** Required
- **Response:** 50 most recent security audit events.

---

## 16. Frontend Application Modules

- **Landing Page (`/`):** Hero section, live security pipeline visualization, statistics strip, problem comparison, 3-step guide, zero-trust architecture breakdown, security capability cards, tamper demo link, technology cards, security principles, and dynamic navbar/footer.
- **Sign Up (`/register`):** Account registration with Zod validation, Firebase identity creation, and email verification trigger.
- **Firebase Email Verification (`/verify-email`):** Dedicated page displaying target email address, verification instructions, **Account Verified** check button, and **Resend Verification Link** action.
- **Sign In (`/login`):** Master password authentication issuing HTTP-only session cookie.
- **Vault Dashboard (`/dashboard`):** Search filter bar, master passphrase input, statistics summary (files count, storage size, encryption coverage), file upload dropzone, upload stage progress bar, responsive Grid/List file views, metadata inspector modal, download modal, and delete confirmation modal.
- **Security Center (`/security`):** Verified capability matrix, Trust Boundary & Authorization flow diagrams, interactive AES-256-GCM 1-byte tamper detection demo, live audit event timeline, and 12-point automated WebCrypto test suite.

---

## 17. Upload Process

```text
[User Drops File] -> [Validate Size (<100MB)] -> [Generate 256-bit DEK in RAM] 
                                                         |
[Encrypt File Bytes with AES-256-GCM] -> [Derive KEK via PBKDF2] -> [Wrap DEK]
                                                         |
[POST /api/files/upload-url] -> [Receive Presigned PUT URL] -> [PUT Body to S3]
                                                         |
[POST /api/files Metadata Package] -> [MongoDB Saved] -> [Refresh Dashboard]
```

---

## 18. Download Process

```text
[Click Download] -> [GET /api/files/:id/download-url] -> [Receive Presigned GET + Meta]
                                                                   |
[Fetch ArrayBuffer from S3] -> [Derive KEK via PBKDF2] -> [Unwrap DEK]
                                                                   |
[Decrypt ArrayBuffer with DEK] -> [Verify AES-GCM Tag] -> [Trigger Local Blob Download]
```

---

## 19. Delete Process

1. User clicks Delete on a file card.
2. Confirmation modal opens displaying file details.
3. User confirms deletion → `DELETE /api/files/:id`.
4. Express backend checks `File.findOne({ _id: id, ownerId: req.user.id })`.
5. Backend invokes `deleteS3Object(s3Key)` via AWS SDK v3.
6. Backend executes `File.deleteOne({ _id: id })`.
7. Audit log records `FILE_DELETE` event.

---

## 20. Search and Filtering

Search filtering runs client-side over the authorized `vaultFiles` array using `useMemo`:

```javascript
const filteredFiles = useMemo(() => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return vaultFiles;

  return vaultFiles.filter((file) => {
    const name = (file.originalName || file.filename || '').toLowerCase();
    const mime = (file.mimeType || '').toLowerCase();
    const s3Key = (file.s3Key || '').toLowerCase();

    return name.includes(query) || mime.includes(query) || s3Key.includes(query);
  });
}, [vaultFiles, searchQuery]);
```

---

## 21. Audit Logging

Security events are tracked by `logAuditEvent`:
- **Captured Events:** `LOGIN_SUCCESS`, `LOGIN_FAILED`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `FILE_DELETE`, `ACCESS_DENIED`.
- **Sanitization:** All details pass through `sanitizeDetails()` which redacts passwords, DEKs, KEKs, tokens, cookies, presigned URLs, and AWS secrets.
- **Access Control:** `GET /api/audit` returns logs strictly filtered by `userId: req.user.id`.

---

## 22. Tamper Detection

VaultX provides a 100% browser-only AES-256-GCM tamper detection demonstration:
1. Generates sample plaintext in browser RAM.
2. Encrypts payload with AES-256-GCM.
3. Clones the ArrayBuffer ciphertext and flips 1 byte (`view[0] ^= 0xFF`).
4. Attempts authenticated decryption.
5. AES-GCM authentication tag verification fails, displaying `"Tampering detected: AES-GCM authentication rejected modified ciphertext."`

---

## 23. Security Controls

| Security Control | Implementation |
|---|---|
| Client-Side Encryption | Web Crypto API (`window.crypto.subtle`) |
| Cipher Algorithm | AES-256-GCM (256-bit key, 128-bit tag) |
| Key Derivation | PBKDF2-HMAC-SHA-256 (100,000 iterations) |
| Key Isolation | Unique 256-bit DEK per file |
| Nonce Isolation | Dedicated 96-bit `fileIV` and `wrapIV` |
| Identity Management | Firebase Authentication + Email Verification |
| Session Security | HTTP-Only `vaultx_token` JWT cookie |
| Authorization | Database ownership scoping (`ownerId === req.user.id`) |
| Cloud Storage | Private AWS S3 bucket with presigned URLs |
| Audit Trail | MongoDB AuditLog collection & safe `auditService` |
| Tamper Verification | AES-GCM tag check & Security Center demo |

---

## 24. Threat Model

| Threat | Mitigation |
|---|---|
| Plaintext Interception | Browser encrypts files before network transmission |
| Compromised Application Server | Backend holds zero plaintext files or raw encryption keys |
| Unauthorized File Access | Scoped queries `File.findOne({ _id, ownerId })` return 404 |
| Ciphertext Modification | AES-GCM 128-bit authentication tag check rejects tampered data |
| Token Theft via XSS | Authentication tokens stored in HTTP-Only cookies |
| S3 Public Exposure | Block Public Access enabled; direct transfers use short-lived URLs |
| Leaked Credentials | Credentials stored strictly in backend `.env` files |

---

## 25. Error Handling

- **Invalid Credentials:** Returns HTTP 401 and logs `LOGIN_FAILED`.
- **Unauthenticated API Request:** `protect` middleware returns HTTP 401.
- **Unauthorized File Request:** `fileController` returns HTTP 404 and logs `ACCESS_DENIED`.
- **Firebase Email Not Verified:** `completeRegistration` blocks session activation until email link is verified.
- **S3 CORS Error:** `fileService` catches fetch errors and displays bucket CORS instructions.
- **Tampered Ciphertext / Wrong Passphrase:** Web Crypto API throws `OperationError`, caught and displayed in UI.

---




## 27. Installation and Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Git

### Installation Steps:
```bash
# 1. Clone repository
git clone https://github.com/himanshuantal5640/CipherVault.git
cd CipherVault

# 2. Setup Server
cd server
npm install
# Create server/.env file with environment variables

# 3. Setup Client
cd ../client
npm install
# Create client/.env file with environment variables

# 4. Start Development Servers
# Terminal 1 (Backend):
cd server
npm run dev

# Terminal 2 (Frontend):
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 28. Firebase Setup
1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** under **Authentication → Sign-in method**.
3. Copy Web App config keys into `client/.env`.
4. Generate a Service Account Private Key under **Project Settings → Service accounts** and populate `server/.env`.

---

## 29. MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster.
2. Create a database user with Read/Write access.
3. Add IP `0.0.0.0/0` under Network Access.
4. Copy connection string to `MONGODB_URI` in `server/.env`.

---

## 30. AWS S3 Setup
1. Create a private S3 bucket in AWS Console.
2. Keep **Block All Public Access** enabled.
3. Configure bucket CORS under **Permissions**:
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
4. Create an IAM user with `AmazonS3FullAccess` (or specific bucket policy) and populate AWS environment variables in `server/.env`.

---

## 31. Local Application Usage — STEP BY STEP

### Step 1: Open VaultX
Navigate to `http://localhost:5173`.

### Step 2: Register Account
Click **Get Started**, enter your email and master password, and click **Register & Verify Email**.

### Step 3: Verify Email
Check your email inbox, click the Firebase verification link, return to the app, and click **Account Verified**.

### Step 4: Master Passphrase Input
On the Vault Dashboard, verify or enter your master passphrase in the header bar.

### Step 5: Upload File
Drag & drop a file into the upload dropzone. Watch the stage progress indicator execute local encryption, presigned S3 URL retrieval, direct ciphertext upload, and metadata saving.

### Step 6: Inspect Metadata
Click the **Code** icon on any file card to view non-secret metadata (DEK ciphertext, IVs, salt, algorithm).

### Step 7: Download & Decrypt File
Click **Download**, enter your master passphrase, and click **Download & Decrypt**. The ciphertext will download from S3 and decrypt locally into your original file.

### Step 8: Security Center & Tamper Test
Navigate to **Security Center** (`/security`). Click **Run Tamper Test** under the AES-256-GCM Tamper Demo section to observe authenticated integrity protection in action.

---

## 32. Production Deployment

### Backend (Render)
- Deploy `server` subdirectory as a **Web Service**.
- Build Command: `npm install`
- Start Command: `npm start`
- Set all backend environment variables on Render.

### Frontend (Vercel)
- Deploy `client` subdirectory to **Vercel**.
- Set `VITE_API_URL` to your Render backend URL (`https://YOUR_APP.onrender.com/api`).
- Add Vercel URL to Firebase Authorized Domains and AWS S3 CORS.

---

## 33. Deployment Architecture

```text
User Device -> Vercel (React Frontend) -> Web Crypto API (Client RAM)
                                                  |
                                    (Presigned Ciphertext Transfer)
                                                  v
Render (Express API) <---> MongoDB Atlas     AWS S3 Bucket
```

---

## 34. Testing

Automated WebCrypto verification suite runs 12 tests on the `/security` page:
1. Encrypt → Decrypt Byte Matching
2. Ciphertext Nonce Variance
3. Per-File DEK Isolation
4. IV Separation (File IV vs Wrap IV)
5. Incorrect Passphrase Protection
6. AES-256-GCM Tamper Detection (1-Byte Flip)
7. Wrapped DEK Tamper Detection
8. Modified IV Rejection
9. 1MB Binary Buffer Performance
10. Zero Plaintext Keys in localStorage
11. Console Secret Isolation
12. Zero Plaintext Network Transmission

---

## 35. Security Testing Checklist

- [x] WebCrypto encryption executes client-side.
- [x] Zero plaintext file contents sent to Node.js backend.
- [x] Passwords hashed with bcrypt (cost 12).
- [x] JWT sessions issued in HTTP-Only cookies.
- [x] Firebase Email Verification enforced prior to activation.
- [x] All file operations scoped to `ownerId === req.user.id`.
- [x] AWS S3 bucket public access blocked.
- [x] AWS credentials restricted to backend environment.
- [x] Audit log details sanitized against secret leaks.

---

## 36. Limitations

- **Browser Device Security:** Security relies on a clean, uncompromised client device and browser environment.
- **Passphrase Memory:** If a user loses their master passphrase, files cannot be decrypted (Zero-Knowledge model).
- **File Size Threshold:** Current UI progress indicator is optimized for files up to 100 MB.

---

## 37. Future Enhancements

- Multi-recipient end-to-end encrypted sharing via public key cryptography (ECDH).
- Hardware key (WebAuthn / YubiKey) passphrase protection.
- Chunked streaming encryption for files exceeding 1 GB.

---

## 38. Conclusion

VaultX demonstrates a complete, production-grade implementation of zero-trust web security. By moving file encryption to the browser via the Web Crypto API, utilizing private AWS S3 cloud storage with presigned URLs, enforcing owner authorization in Node.js/MongoDB, and leveraging Firebase Authentication, VaultX ensures user data remains private and tamper-evident.

---

## 39. Demo Flow for Judges (3-Minute Script)

1. **Landing Page (0:00 - 0:30):** Show landing page, trust boundary diagram, and tagline.
2. **Registration & Email Verification (0:30 - 1:00):** Show registration form and Firebase email verification flow.
3. **File Upload & S3 Ciphertext Verification (1:00 - 1:45):** Upload a file. Open AWS S3 Console to show that stored object is raw ciphertext.
4. **Download & Decryption (1:45 - 2:15):** Click Download, enter passphrase, and show restored plaintext file.
5. **Security Center & Tamper Demo (2:15 - 3:00):** Run the 1-byte AES-GCM tamper test and review live audit logs.

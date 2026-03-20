# 🔗 SecureLink — Security-First URL Shortener

A production-ready URL shortener platform with built-in malware detection. Every URL is scanned against **Google Safe Browsing** and **VirusTotal** before shortening. Includes custom slugs, QR code generation, click analytics, and automatic expiry.

---

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

---

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────┐
│   React UI  │──────▶│  Spring Boot API  │──────▶│  PostgreSQL    │
│  (Vercel)   │       │  (Railway/Render) │       │  (Neon/Supa)   │
└─────────────┘       └────────┬─────────┘       └────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼                     ▼
          ┌─────────────────┐   ┌──────────────────┐
          │ Google Safe     │   │ VirusTotal API   │
          │ Browsing API v4 │   │                  │
          └─────────────────┘   └──────────────────┘
```

---

## 🚀 Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Backend     | Java 17+, Spring Boot 3.2, Spring Data JPA    |
| Database    | PostgreSQL (H2 for development)               |
| Caching     | Caffeine (Spring Cache)                       |
| QR Codes    | ZXing (300×300 PNG, Base64 encoded)            |
| Security    | Google Safe Browsing API, VirusTotal API       |
| Frontend    | React 19, React Router, Axios, Tailwind CSS 3 |
| Build       | Maven (backend), Vite (frontend)              |

---

## 📂 Project Structure

```
URLshortener/
├── backend/
│   ├── src/main/java/com/urlshortener/
│   │   ├── controller/        # REST endpoints
│   │   │   ├── UrlController.java
│   │   │   └── RedirectController.java
│   │   ├── service/           # Business logic
│   │   │   ├── UrlShortenerService.java
│   │   │   ├── SafetyCheckService.java
│   │   │   └── QrCodeService.java
│   │   ├── repository/        # Data access
│   │   │   └── UrlMappingRepository.java
│   │   ├── model/             # JPA entities
│   │   │   └── UrlMapping.java
│   │   ├── dto/               # Data transfer objects
│   │   │   ├── ShortenRequest.java
│   │   │   ├── ShortenResponse.java
│   │   │   ├── QrRequest.java
│   │   │   ├── SafetyResult.java
│   │   │   └── ErrorResponse.java
│   │   ├── config/            # Configuration
│   │   │   ├── CacheConfig.java
│   │   │   └── CorsConfig.java
│   │   ├── exception/         # Error handling
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── SlugAlreadyExistsException.java
│   │   │   ├── UrlBlockedException.java
│   │   │   └── UrlNotFoundException.java
│   │   ├── scheduler/         # Scheduled tasks
│   │   │   └── ExpiryScheduler.java
│   │   └── util/              # Utilities
│   │       └── SlugValidator.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-prod.properties
│   │   └── schema.sql
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── URLForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── QRCode.jsx
│   │   │   └── RiskBadge.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.production
│   ├── vercel.json
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📌 API Endpoints

### `POST /api/shorten` — Create Short URL

**Request:**
```json
{
  "originalUrl": "https://amazon.com/product/123",
  "customSlug": "myphone"
}
```

**Response (200):**
```json
{
  "id": 1,
  "originalUrl": "https://amazon.com/product/123",
  "shortUrl": "https://app.com/myphone",
  "customSlug": "myphone",
  "riskScore": 10,
  "safe": true,
  "safetyStatus": "SAFE",
  "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "clickCount": 0,
  "createdAt": "2026-03-16T19:00:00",
  "expiryDate": "2026-04-15T19:00:00"
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 400    | Validation error (invalid URL, slug format) |
| 403    | URL blocked (risk score ≥ 70) |
| 409    | Slug already exists |

---

### `POST /api/qr` — Generate QR Code

**Request:**
```json
{
  "url": "https://app.com/myphone"
}
```

**Response (200):**
```json
{
  "qrCode": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

### `GET /{slug}` — Redirect

**Response:** `302 Found` → Redirects to original URL.

Returns `404` if slug not found.

---

### `GET /api/urls` — Dashboard (List All)

**Response (200):**
```json
[
  {
    "id": 1,
    "originalUrl": "https://amazon.com/product/123",
    "shortUrl": "https://app.com/myphone",
    "customSlug": "myphone",
    "riskScore": 10,
    "safe": true,
    "safetyStatus": "SAFE",
    "clickCount": 42,
    "createdAt": "2026-03-16T19:00:00",
    "expiryDate": "2026-04-15T19:00:00"
  }
]
```

---

## 🔐 Security Check Module

When a URL is submitted, the system:

1. **Calls both APIs in parallel** using `CompletableFuture`
2. **Google Safe Browsing API v4** — Checks for malware, social engineering, unwanted software
3. **VirusTotal API** — Submits URL for scanning, checks analysis results
4. **Combines results** into a risk score (0–100)

### Risk Score Rules

| Score   | Status    | Action                       |
|---------|-----------|------------------------------|
| ≥ 70    | BLOCKED   | URL creation rejected        |
| 31–69   | WARNING   | Warning shown, creation allowed |
| < 30    | SAFE      | URL marked as safe           |

---

## ⚙️ Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.9+
- PostgreSQL (or use H2 for dev)

### Backend

```bash
cd backend

# Run with H2 (development)
mvn spring-boot:run

# Run with PostgreSQL
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

### Backend

| Variable                      | Description                    |
|-------------------------------|--------------------------------|
| `GOOGLE_SAFE_BROWSING_API_KEY`| Google Safe Browsing API key   |
| `VIRUSTOTAL_API_KEY`          | VirusTotal API key             |
| `DATABASE_URL`                | PostgreSQL connection URL      |
| `DATABASE_USERNAME`           | Database username              |
| `DATABASE_PASSWORD`           | Database password              |
| `APP_BASE_URL`                | Base URL for short links       |
| `PORT`                        | Server port (default: 8080)    |

### Frontend

| Variable       | Description           |
|----------------|-----------------------|
| `VITE_API_URL` | Backend API base URL  |

---

## 🚀 Deployment

### Backend → Railway

1. Push the `backend/` directory to a GitHub repo
2. Connect repo to [Railway](https://railway.app)
3. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL addon)
   - `GOOGLE_SAFE_BROWSING_API_KEY`
   - `VIRUSTOTAL_API_KEY`
   - `APP_BASE_URL` = your Railway domain
   - `SPRING_PROFILES_ACTIVE` = `prod`
4. Railway auto-detects the Dockerfile and deploys

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set Build Command: `cd backend && mvn clean package -DskipTests`
4. Set Start Command: `java -jar -Dspring.profiles.active=prod backend/target/*.jar`
5. Add environment variables (same as Railway)
6. Add PostgreSQL addon and link

### Frontend → Vercel

1. Push the `frontend/` directory to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Set environment variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://urlshortener.railway.app`)
5. Deploy

### Database → Neon / Supabase

1. Create a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Run `schema.sql` to create the table
3. Copy the connection string to backend env vars

---

## 📊 Database Schema

```sql
CREATE TABLE url_mapping (
    id              BIGSERIAL       PRIMARY KEY,
    original_url    VARCHAR(2048)   NOT NULL,
    custom_slug     VARCHAR(30)     NOT NULL UNIQUE,
    risk_score      INTEGER         NOT NULL DEFAULT 0,
    is_safe         BOOLEAN         NOT NULL DEFAULT TRUE,
    click_count     BIGINT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     TIMESTAMP       NOT NULL
);

CREATE INDEX idx_url_mapping_slug ON url_mapping (custom_slug);
CREATE INDEX idx_url_mapping_expiry ON url_mapping (expiry_date);
```

---

## 🔄 URL Expiry

- Each short URL expires after **30 days**
- A scheduled job runs **daily at midnight** (`ExpiryScheduler.java`)
- Expired URLs are automatically deleted and cache is evicted

---

## 📦 Caching

- Uses **Caffeine** in-memory cache via Spring Cache
- URL lookups during redirect are cached (`@Cacheable("urls")`)
- Cache TTL: 10 minutes, max 10,000 entries
- Cache is evicted when expired URLs are cleaned up

---

## 📄 License

This project is licensed under the MIT License.

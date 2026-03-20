# 🔗 Cutify — Lightning-Fast URL Shortener

A beautifully designed, production-ready URL shortener platform. Cutify allows you to generate custom short links instantly, complete with scannable QR codes, click analytics, and automatic 2-day URL expiry.

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
└─────────────┘       └──────────────────┘       └────────────────┘
```

---

## 🚀 Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Backend     | Java 17+, Spring Boot 3.2, Spring Data JPA    |
| Database    | PostgreSQL (H2 for local development)         |
| Caching     | Caffeine (Spring Cache)                       |
| QR Codes    | ZXing (300×300 PNG, Base64 encoded)            |
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
│   │   │   └── QrCodeService.java
│   │   ├── repository/        # Data access
│   │   │   └── UrlMappingRepository.java
│   │   ├── model/             # JPA entities
│   │   │   └── UrlMapping.java
│   │   ├── dto/               # Data transfer objects
│   │   │   ├── ShortenRequest.java
│   │   │   ├── ShortenResponse.java
│   │   │   ├── QrRequest.java
│   │   │   └── ErrorResponse.java
│   │   ├── config/            # Configuration
│   │   │   ├── CacheConfig.java
│   │   │   └── CorsConfig.java
│   │   ├── exception/         # Error handling
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── SlugAlreadyExistsException.java
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
│   │   │   └── QRCode.jsx
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
  "shortUrl": "https://cutify.com/myphone",
  "customSlug": "myphone",
  "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "clickCount": 0,
  "createdAt": "2026-03-20T19:00:00",
  "expiryDate": "2026-03-22T19:00:00"
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 400    | Validation error (invalid URL, slug format) |
| 409    | Slug already exists |

---

### `POST /api/qr` — Generate QR Code

**Request:**
```json
{
  "url": "https://cutify.com/myphone"
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
    "shortUrl": "https://cutify.com/myphone",
    "customSlug": "myphone",
    "clickCount": 42,
    "createdAt": "2026-03-20T19:00:00",
    "expiryDate": "2026-03-22T19:00:00"
  }
]
```

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

# Run with local database
mvn spring-boot:run

# Run with PostgreSQL cloud
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
   - `APP_BASE_URL` = your Railway domain (e.g. `https://cutify.com`)
   - `SPRING_PROFILES_ACTIVE` = `prod`
4. Railway auto-detects the Dockerfile and deploys

### Frontend → Vercel

1. Push the `frontend/` directory to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Set environment variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://api.cutify.com`)
5. Deploy

### Database → Neon / Supabase

1. Create a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string to backend env vars

---

## 📊 Database Schema

```sql
CREATE TABLE url_mapping (
    id              BIGSERIAL       PRIMARY KEY,
    original_url    VARCHAR(2048)   NOT NULL,
    custom_slug     VARCHAR(30)     NOT NULL UNIQUE,
    click_count     BIGINT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     TIMESTAMP       NOT NULL
);

CREATE INDEX idx_url_mapping_slug ON url_mapping (custom_slug);
CREATE INDEX idx_url_mapping_expiry ON url_mapping (expiry_date);
```

*(Note: If legacy columns like `risk_score` or `is_safe` exist, they are safely ignored by the application after optimization).*

---

## 🔄 URL Expiry

- Each short URL strictly expires after **2 days**.
- A scheduled job runs **daily at midnight** (`ExpiryScheduler.java`).
- Expired URLs are automatically deleted and cache is evicted to keep the database fully optimized.

---

## 📦 Caching

- Uses **Caffeine** in-memory cache via Spring Cache
- URL lookups during redirect are highly cached for ultra-fast performance (`@Cacheable("urls")`).
- Cache TTL: 10 minutes, max 10,000 entries.

---

## 📄 License

This project is licensed under the MIT License.

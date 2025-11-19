# 🔗 TinyLink - URL Shortener

<div align="center">

![TinyLink](https://img.shields.io/badge/TinyLink-URL_Shortener-purple?style=flat-square&logo=chain)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![Postgres](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

### 🚀 Lightning-fast URL shortening with beautiful, animated UI

[🌐 Live Demo](#-deployment) • [📖 Documentation](#-documentation) • [🛠️ Setup Guide](#-setup) • [📊 API Reference](#-api-endpoints)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- ✅ **Create Short Links** - Convert long URLs to short codes
- ✅ **Custom Codes** - Use custom short codes (6-8 characters)
- ✅ **Click Tracking** - Monitor clicks and last clicked time
- ✅ **Link Management** - View, edit, and delete links
- ✅ **Statistics** - Detailed stats for each link

</td>
<td width="50%">

### 🎨 Design & UX
- 🌈 **Animated UI** - Smooth transitions and interactions
- 📱 **Responsive Design** - Works on all devices
- 🎭 **Dark Theme** - Beautiful gradient backgrounds
- ⚡ **Fast Performance** - Optimized for speed
- 🔐 **Form Validation** - Real-time error handling

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

```
┌──────────────────────────────────────────────────────────┐
│                    🏗️ Architecture                       │
├──────────────────────────────────────────────────────────┤
│  Frontend          │  Next.js 14 + React 18 + TypeScript │
│  Styling          │  Tailwind CSS + Custom Animations    │
│  Backend API      │  Next.js API Routes                  │
│  Database         │  PostgreSQL (Neon)                  │
│  ORM             │  Prisma                              │
│  Deployment       │  Vercel                              │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Pages & Routes

| Page | Path | Description |
|------|------|-------------|
| 🏠 **Dashboard** | `/` | Create links, view all links, manage links |
| 📈 **Stats** | `/code/:code` | Detailed analytics for a single short link |
| 🔄 **Redirect** | `/:code` | Automatic redirect with click tracking |
| 🏥 **Health Check** | `/healthz` | System health status |

---

## 🔌 API Endpoints

### Link Management

```bash
# Create a new short link
POST /api/links
Content-Type: application/json

{
  "targetUrl": "https://example.com/very/long/url",
  "code": "custom" // Optional
}

# Response (201 Created)
{
  "id": "cuid...",
  "code": "custom",
  "targetUrl": "https://example.com/very/long/url",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "lastClicked": null
}
```

```bash
# Get all links
GET /api/links

# Response (200 OK)
[
  {
    "id": "cuid...",
    "code": "custom",
    "targetUrl": "https://example.com/very/long/url",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastClicked": "2024-01-01T12:00:00Z"
  }
]
```

```bash
# Get stats for a single link
GET /api/links/:code

# Response (200 OK)
{
  "id": "cuid...",
  "code": "custom",
  "targetUrl": "https://example.com/very/long/url",
  "clicks": 5,
  "createdAt": "2024-01-01T00:00:00Z",
  "lastClicked": "2024-01-01T12:00:00Z"
}

# Response if not found (404 Not Found)
{
  "error": "Link not found"
}
```

```bash
# Delete a link
DELETE /api/links/:code

# Response (200 OK)
{
  "success": true
}

# Response if not found (404 Not Found)
{
  "error": "Link not found"
}
```

### Health Check

```bash
# Check system health
GET /healthz

# Response (200 OK)
{
  "ok": true,
  "version": "1.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🚀 Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tinylink.git
   cd tinylink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database URL:
   ```env
   DATABASE_URL=postgresql://user:password@neon.tech/database
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🏗️ Project Structure

```
tinylink/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts              # Health check endpoint
│   │   └── links/
│   │       ├── route.ts              # List & create links
│   │       └── [code]/
│   │           └── route.ts          # Get & delete single link
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx              # Stats page
│   ├── [code]/
│   │   └── route.ts                  # Redirect logic
│   ├── layout.tsx                    # Root layout with header/footer
│   ├── page.tsx                      # Dashboard page
│   └── globals.css                   # Global styles & animations
├── lib/
│   ├── db.ts                         # Prisma client
│   └── utils.ts                      # Utility functions
├── prisma/
│   └── schema.prisma                 # Database schema
├── .env.example                      # Environment variables template
└── package.json
```

---

## 🎨 UI Features

### Dashboard
- 📝 Create new links with custom codes
- 🔍 Search and filter links
- 📋 Copy short links to clipboard
- 🗑️ Delete links with confirmation
- 📈 Quick access to stats page
- ✅ Real-time success/error messages

### Stats Page
- 📊 Click statistics
- ⏰ Last clicked timestamp
- 🔗 Quick copy buttons
- 📈 Performance metrics (clicks/day)
- 🎯 Link age and status

### Animations
- ✨ Fade-in effects
- 🌈 Gradient animations
- 💫 Pulse glow effects
- 📱 Smooth transitions
- ⚡ Loading spinners

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project
   - Click "Deploy"

3. **Set environment variables in Vercel**
   - `DATABASE_URL` - Your Neon PostgreSQL URL
   - `NEXT_PUBLIC_BASE_URL` - Your deployed URL

4. **Run migrations on Vercel**
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

### Alternative Deployments

**Render + Neon**
```bash
# Push to GitHub first
git push origin main

# Deploy on Render
# 1. Connect GitHub repository
# 2. Set build command: npm run build
# 3. Set start command: npm start
# 4. Add environment variables
```

**Railway + Neon**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Create a link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://github.com",
    "code": "github"
  }'

# Get all links
curl http://localhost:3000/api/links

# Get stats for a link
curl http://localhost:3000/api/links/github

# Test redirect
curl -L http://localhost:3000/github

# Delete a link
curl -X DELETE http://localhost:3000/api/links/github

# Health check
curl http://localhost:3000/healthz
```

---

## 🔐 Code Rules

- Format: `[A-Za-z0-9]{6,8}`
- Globally unique across all users
- Cannot be changed after creation
- Alphanumeric characters only

---

## 📝 Database Schema

```sql
CREATE TABLE Link (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  targetUrl TEXT NOT NULL,
  clicks INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  lastClicked TIMESTAMP NULL,
  
  INDEX idx_code (code)
);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ as a recruitment assignment.

---

## 📞 Support

If you have questions or need help:

- 📧 Email: support@tinylink.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/tinylink/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/tinylink/discussions)

---

<div align="center">

### Made with 💖 using Next.js, React, and TypeScript

⭐ If you find this useful, please give it a star!

</div>

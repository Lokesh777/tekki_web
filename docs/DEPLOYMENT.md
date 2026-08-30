# Deployment Guide
## Internal Project Management System

---

## 1. Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier)
- Render.com account (free tier)
- Netlify account (free tier)
- GitHub account

---

## 2. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/project_management?retryWrites=true&w=majority
   ```

---

## 3. Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/tekki_webSol.git
git push -u origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name:** tekki-pm-backend
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

### Step 3: Set Environment Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=1h
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://your-app.netlify.app
WS_CORS_ORIGIN=https://your-app.netlify.app
```

### Step 4: Deploy
- Render auto-deploys on push to main
- Check logs for any errors

---

## 4. Frontend Deployment (Netlify)

### Step 1: Update Environment Variables
Create `.env.production.local`:
```
NEXT_PUBLIC_API_URL=https://tekki-pm-backend.onrender.com/api
NEXT_PUBLIC_WS_URL=https://tekki-pm-backend.onrender.com
```

### Step 2: Create Netlify Site
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory:** frontend
   - **Build command:** npm run build
   - **Publish directory:** .next

### Step 3: Set Environment Variables
```
NEXT_PUBLIC_API_URL=https://tekki-pm-backend.onrender.com/api
NEXT_PUBLIC_WS_URL=https://tekki-pm-backend.onrender.com
```

### Step 4: Deploy
- Netlify auto-deploys on push to main

---

## 5. GitHub Secrets Setup

For CI/CD pipeline, add these secrets in GitHub repo settings:

| Secret | Description |
|--------|-------------|
| `RENDER_SERVICE_ID` | Render service ID |
| `RENDER_API_KEY` | Render API key |
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token |
| `NETLIFY_SITE_ID` | Netlify site ID |

---

## 6. Custom Domain (Optional)

### Render Backend
1. Go to Settings → Custom Domains
2. Add domain: `api.yourdomain.com`
3. Update DNS records as instructed

### Netlify Frontend
1. Go to Domain Settings
2. Add custom domain: `yourdomain.com`
3. Enable HTTPS (auto via Let's Encrypt)

---

## 7. Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads: `https://your-frontend.netlify.app`
- [ ] Login works
- [ ] Real-time updates work
- [ ] No console errors

---

## 8. Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all env vars are set

### Frontend Issues
- Check Netlify function logs
- Verify API URL in env vars
- Clear browser cache

### WebSocket Issues
- Ensure CORS is configured correctly
- Check that WS_CORS_ORIGIN matches frontend URL
- Verify Socket.IO path is correct

---

## 9. Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm install
npm run dev
```

---

## 10. URLs After Deployment

| Service | URL |
|---------|-----|
| Backend API | https://tekki-pm-backend.onrender.com |
| Frontend | https://your-app.netlify.app |
| Health Check | https://tekki-pm-backend.onrender.com/health |

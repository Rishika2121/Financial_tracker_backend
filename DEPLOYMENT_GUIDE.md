# 🚀 Deployment Guide: Render + Vercel

## ✅ Backend Deployment (Render.com)

### Step 1: Prepare Your Backend
1. Add a `.env` file with these variables:
   ```
   PORT=5000
   NODE_ENV=production
   GROQ_API_KEY=your_groq_api_key_here
   DATABASE_URL=postgresql://user:password@host/db (if using DB)
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

2. Ensure your `package.json` has:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

### Step 2: Deploy to Render
1. Go to https://render.com
2. Sign up and connect your GitHub repository
3. Click **"New Web Service"**
4. Select your GitHub repo (with this backend code)
5. Fill in these details:
   - **Name**: `expense-tax-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose Free tier (or paid)

6. Click **"Advanced"** and add Environment Variables:
   - `PORT` → `5000`
   - `NODE_ENV` → `production`
   - `GROQ_API_KEY` → Your Groq API key
   - `DATABASE_URL` → Your DB connection string (if using DB)
   - `ALLOWED_ORIGINS` → Your Vercel frontend URL

7. Click **"Create Web Service"**
8. Wait for deployment (takes ~2-3 minutes)
9. Copy your Render URL (e.g., `https://expense-tax-backend.onrender.com`)

---

## ✅ Frontend Deployment (Vercel.com)

### Step 1: Update Frontend Environment Variables
In your Vercel frontend project, create `.env.local`:
```
REACT_APP_API_URL=https://expense-tax-backend.onrender.com/api
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up and connect your GitHub
3. Click **"Import Project"**
4. Select your frontend repository
5. Add Environment Variables:
   - `REACT_APP_API_URL` → `https://expense-tax-backend.onrender.com/api`
   - `REACT_APP_GROQ_API_KEY` → Your Groq API key

6. Click **"Deploy"**
7. Wait for deployment to complete
8. Your Vercel URL will be shown (e.g., `https://your-frontend.vercel.app`)

---

## 🔄 Update Backend CORS Settings

After getting your Vercel URL, update backend's `ALLOWED_ORIGINS`:

1. Go to Render Dashboard
2. Select your backend service
3. Go to **Settings** → **Environment**
4. Update `ALLOWED_ORIGINS`:
   ```
   http://localhost:3000,https://your-frontend.vercel.app
   ```
5. Click **"Save" and "Redeploy"**

---

## 🧪 Testing After Deployment

### Backend Health Check:
- Visit: `https://expense-tax-backend.onrender.com/health`
- Should see: `Backend running`

### Chat API Test:
```bash
curl -X POST https://expense-tax-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Section 80C?",
    "userData": {}
  }'
```

---

## ⚠️ Important Notes

### Keep Render Alive (Free Tier)
- Free Render instances sleep after 15 minutes of inactivity
- Add a simple monitoring tool to keep it awake:
  - Go to UptimeRobot.com
  - Create a monitor pointing to your health endpoint
  - Set interval to every 5 minutes

### API Keys Security
- **Never commit `.env` file to GitHub**
- Always use Environment Variables in Render/Vercel dashboards
- Rotate your Groq API key if exposed

### CORS Issues
If you get CORS errors, ensure:
1. `ALLOWED_ORIGINS` includes your Vercel URL
2. Backend has redeployed after changing CORS settings
3. Frontend is using correct API URL from environment variables

---

## 📞 Troubleshooting

**Backend Not Responding**
- Check Render logs: Render Dashboard → Your Service → Logs
- Ensure all environment variables are set
- Verify Groq API key is valid

**CORS Errors**
- Update `ALLOWED_ORIGINS` environment variable
- Redeploy backend after changes
- Your frontend URL must be listed in ALLOWED_ORIGINS

**Chat API Not Working**
- Test with curl to verify backend
- Check Groq API key in Render environment variables
- View Render logs for error messages

---

## 🎯 Quick Deploy Checklist

- [ ] `.env.example` created locally with all needed variables
- [ ] `package.json` has `start` and `dev` scripts
- [ ] Backend pushed to GitHub
- [ ] Render service created with all env variables
- [ ] Backend health check working
- [ ] Frontend URL added to ALLOWED_ORIGINS in Render
- [ ] Frontend pushed to GitHub
- [ ] Vercel service created with API URL env variable
- [ ] Frontend can make requests to backend
- [ ] Chat API working end-to-end

Enjoy! 🎉

# 🚀 IntelliInsight Deployment Guide

Complete guide for deploying IntelliInsight to production using free hosting services.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account (free tier)
- Railway/Render account (free tier)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account and sign in
3. Create a new cluster (M0 Sandbox - FREE)
4. Choose your preferred cloud provider and region
5. Create cluster (takes 5-10 minutes)

### 2. Configure Database Access

1. In Atlas dashboard, go to "Database Access"
2. Add new database user:
   - Username: `intelliinsight`
   - Password: Generate secure password
   - Built-in role: `Atlas admin`
3. Go to "Network Access"
4. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)

### 3. Get Connection String

1. In Atlas dashboard, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

## 🤖 AI Service Deployment (Railway)

### 1. Prepare AI Service for Deployment

1. Fork this repository to your GitHub account
2. Create `ai-service/railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
```

### 2. Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up
2. Create new project from GitHub repo
3. Select the `ai-service` folder as root
4. Set environment variables:
   ```
   PORT=8000
   PYTHONPATH=/app
   ```
5. Deploy (will auto-deploy from GitHub)

### Alternative: Deploy to Render

1. Go to [Render](https://render.com) and sign up
2. Create new Web Service from GitHub repo
3. Configure:
   - Root Directory: `ai-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables and deploy

## 🖥️ Backend Deployment (Railway/Render)

### 1. Configure Backend Environment

Create `backend/.env.production`:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
AI_SERVICE_URL=https://your-ai-service-url.railway.app
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
```

### 2. Deploy Backend to Railway

1. Create new Railway project for backend
2. Connect to GitHub repo, select `backend` folder
3. Set environment variables from `.env.production`
4. Deploy

## 🌐 Frontend Deployment (Vercel)

### 1. Configure Frontend Environment

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=IntelliInsight
VITE_APP_VERSION=1.0.0
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `.` (project root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables from `.env.production`
5. Deploy

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

Update your backend environment variables to include the correct frontend URL:

```env
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

### 2. Test the Application

1. Visit your Vercel frontend URL
2. Try uploading a sample PDF
3. Check that analysis works end-to-end
4. Verify data persistence in MongoDB Atlas

### 3. Monitor and Logs

- **Frontend**: Check Vercel dashboard for build logs and analytics
- **Backend**: Check Railway/Render dashboard for application logs
- **Database**: Monitor usage in MongoDB Atlas dashboard
- **AI Service**: Check Railway/Render logs for AI processing

## 🔒 Security Checklist

### Production Security Settings

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Set specific origins instead of `*`
3. **Rate Limiting**: Configure appropriate limits
4. **File Validation**: Ensure PDF validation is working
5. **Database**: Use connection string with strong password

### Update CORS Configuration

In your backend `server.js`, update CORS:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'https://intelliinsight.com' // Your custom domain
  ],
  credentials: true
}));
```

## 📊 Monitoring and Maintenance

### 1. Health Checks

All services include health check endpoints:
- Frontend: Available by default
- Backend: `GET /api/health`
- AI Service: `GET /`

### 2. Database Monitoring

Monitor your MongoDB Atlas cluster:
- Connection count
- Storage usage
- Performance metrics

### 3. Error Tracking

Consider adding error tracking services:
- [Sentry](https://sentry.io) for error monitoring
- [LogRocket](https://logrocket.com) for user session tracking

## 🎯 Custom Domain (Optional)

### 1. Configure Custom Domain

1. Purchase domain from any registrar
2. In Vercel dashboard, add custom domain
3. Configure DNS records as instructed
4. Update CORS settings with new domain

### 2. SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## 💰 Cost Optimization

### Free Tier Limits

- **Vercel**: 100GB bandwidth, unlimited requests
- **Railway**: 500 hours/month, 1GB memory
- **MongoDB Atlas**: 512MB storage, 100 connections
- **Render**: 750 hours/month (alternative to Railway)

### Scaling Considerations

If you exceed free tiers:
- **Database**: Upgrade to M10 cluster ($9/month)
- **Backend/AI**: Upgrade to paid plans on Railway/Render
- **Frontend**: Vercel Pro ($20/month)

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check frontend and backend URLs in environment variables
2. **Database Connection**: Verify MongoDB connection string and network access
3. **AI Service Timeout**: Check AI service logs and increase timeout limits
4. **File Upload Errors**: Verify file size limits and PDF validation

### Debug Steps

1. Check all service logs in their respective dashboards
2. Test API endpoints individually
3. Verify environment variables are set correctly
4. Check network connectivity between services

---

## 🎉 Success!

Your IntelliInsight application should now be fully deployed and accessible at:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-backend-app.railway.app/api`
- **AI Service**: `https://your-ai-service.railway.app`

The application is now ready for production use with a professional deployment setup! 🚀
# Deployment & Deployment Checklist

## Pre-Deployment Requirements

### Security Checklist
- [ ] Change JWT_SECRET in `.env` to strong random value
- [ ] Remove all console.logs from production code
- [ ] Enable HTTPS/TLS on all endpoints
- [ ] Set up CORS properly (whitelist domains)
- [ ] Implement rate limiting on API endpoints
- [ ] Add input validation on all forms
- [ ] Hash passwords using bcrypt (when implementing real auth)
- [ ] Store credentials in secure vault (AWS Secrets Manager, etc.)
- [ ] Never commit `.env` files or credentials
- [ ] Enable CSRF protection if using sessions

### Performance Checklist
- [ ] Minify and bundle frontend (npm run build)
- [ ] Enable gzip compression on backend
- [ ] Implement caching headers
- [ ] Optimize images (convert to WebP)
- [ ] Use CDN for static assets
- [ ] Implement pagination for large lists
- [ ] Add request/response caching
- [ ] Monitor bundle size

### Testing Checklist
- [ ] Test all authentication flows
- [ ] Verify all forms work end-to-end
- [ ] Test on multiple browsers
- [ ] Test on mobile devices (real devices)
- [ ] Verify Sheets integration works
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test offline handling (Phase 2)
- [ ] Verify error messages display correctly

## Frontend Deployment

### Build for Production
```bash
cd frontend
npm run build
```

This creates optimized `build/` directory with:
- Minified JavaScript
- Optimized CSS
- Static assets
- Source maps (optional)

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build first
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Traditional Server
1. Build: `npm run build`
2. Copy `build/` folder to server `/var/www/app/`
3. Configure web server (Nginx/Apache):

**Nginx Example**:
```nginx
server {
    listen 80;
    server_name yourapp.com;

    location / {
        root /var/www/app/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## Backend Deployment

### Prepare for Production
1. Node.js v14+ installed on server
2. PM2 or similar process manager
3. Nginx/Apache reverse proxy
4. MongoDB/PostgreSQL if adding database
5. Google Sheets credentials secure

### Install PM2
```bash
npm install -g pm2
```

### Create Startup Script
```bash
cd backend
pm2 start server.js --name signature-connect
pm2 startup
pm2 save
```

### Automated Restarts
```bash
# On crash
pm2 start server.js --autorestart

# On reboot
pm2 startup

# Save configuration
pm2 save
```

### Deploy to Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set REACTAPP_API_URL=https://your-app.herokuapp.com

# Deploy
git push heroku main
```

### Deploy to AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and npm
3. Clone repository
4. `npm install` in backend directory
5. Configure environment variables
6. Use PM2 for process management
7. Set up Nginx reverse proxy
   
### Environment Variables for Production
```bash
# .env file in backend
PORT=5000
NODE_ENV=production
JWT_SECRET=very-long-random-secret-key-here
REACT_APP_API_URL=https://yourdomain.com

# Google Sheets (if integrating)
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_CREDENTIALS_PATH=/secure/path/to/credentials.json

# Optional monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## Google Sheets Integration (Production)

### Service Account Setup
1. Go to Google Cloud Console
2. Create service account
3. Enable Sheets & Drive APIs
4. Generate JSON key
5. Share your sheet with service account email

### Secure Credentials
```bash
# Store credentials securely
# Option 1: Environment variable (base64 encoded)
export GOOGLE_CREDENTIALS=$(base64 -i /path/to/credentials.json)

# Option 2: Secure vault (AWS Secrets Manager)
aws secretsmanager create-secret --name google-creds --secret-string file://credentials.json

# Option 3: Kubernetes secrets
kubectl create secret generic google-creds --from-file=credentials.json
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

### Configure Nginx for HTTPS
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Log viewing
pm2 logs signature-connect
```

### Error Tracking (Sentry)
```javascript
// backend/server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

### Health Check Endpoint
```bash
# Already implemented
curl https://yourdomain.com/api/health
# Response: {"status":"ok"}
```

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer

# Check before deploying
npm run build -- --analyze
```

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Connection pooling for databases
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000
});
```

## Backup & Disaster Recovery

### Google Sheets Backup
```bash
# Keep backup copy of sheet
# Location: Private Drive folder
# Update frequency: Daily

# Script to backup (Python)
from google.colab import auth
auth.authenticate_user()
# Copy sheet to backup folder
```

### Database Backup (When Added)
```bash
# Daily backups
0 2 * * * mongodump --uri="mongodb://..." --out=/backups/db-$(date +\%Y\%m\%d\%H\%M\%S)
```

### Code Backup
```bash
# Git repository (already done)
# Push to GitHub, GitLab, or Bitbucket
git push origin main
```

## Rollback Plan

### If Deployment Fails
```bash
# Check logs
pm2 logs signature-connect

# Revert to previous version
git revert <commit-hash>
npm install
pm2 restart all

# Or use PM2 version management
pm2 unstartup systemd
pm2 start ecosystem.config.js
```

## Post-Deployment Verification

### Checklist
- [ ] Visit main domain - loads correctly
- [ ] Login page works with demo credentials
- [ ] Can navigate all screens
- [ ] Forms submit successfully
- [ ] Google Sheets updates (if integrated)
- [ ] No console errors in browser
- [ ] API health check returns 200
- [ ] Mobile view works on actual device
- [ ] Images load correctly
- [ ] Fonts render properly
- [ ] Toast notifications appear
- [ ] Logout works

### Performance Metrics
```bash
# Check Core Web Vitals
# Largest Contentful Paint (LCP): < 2.5s
# First Input Delay (FID): < 100ms
# Cumulative Layout Shift (CLS): < 0.1

# Use Google PageSpeed Insights
# Use WebPageTest.org
```

## Scaling Considerations

### As User Base Grows

1. **Database** (When adding one)
   - Implement connection pooling
   - Add read replicas for scaling
   - Use caching layer (Redis)

2. **API Backend**
   - Implement load balancing (nginx)
   - Use PM2 cluster mode
   - Consider microservices later

3. **Frontend**
   - CDN for static assets (CloudFlare)
   - Image optimization
   - Code splitting by route

4. **Google Sheets** (Current bottleneck)
   - Cache responses locally
   - Implement batch operations
   - Consider migrations to database later

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd frontend && npm install && npm run build
      - run: cd backend && npm install # Add tests here

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: git push heroku main
```

## Support & Maintenance

### Weekly Maintenance
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Verify backups completed
- [ ] Check for security updates

### Monthly Maintenance
- [ ] Review user feedback
- [ ] Update dependencies (npm outdated)
- [ ] Performance optimization review
- [ ] Security audit

### Quarterly Reviews
- [ ] Database optimization
- [ ] Cost analysis
- [ ] Scaling assessment
- [ ] Feature planning

---

**Deployment Status**: Ready for Production
**Last Updated**: April 2026
**Recommended Hosting**: Vercel (Frontend) + Heroku/AWS (Backend)

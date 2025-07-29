# 🚀 EcoCommerce Deployment Guide

This guide will help you deploy the EcoCommerce application to production.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- A server or hosting platform (VPS, cloud provider, etc.)
- Domain name (optional but recommended)

## 🏗️ Building for Production

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd ecommerce-app
```

### 2. Build the Application
```bash
# Run the automated build script
node build.js
```

This script will:
- Install all dependencies for both client and server
- Build the React application for production
- Optimize assets and create the build directory

### 3. Configure Environment Variables

Edit `server/.env` with your production settings:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/ecommerce
```

**Important**: 
- Change the JWT_SECRET to a strong, unique value
- Update CORS origins in `server/server.js` to match your domain

## 🌐 Deployment Options

### Option 1: Simple Server Deployment

1. **Start the production server:**
```bash
node start-production.js
```

2. **Or manually:**
```bash
cd server
NODE_ENV=production npm start
```

### Option 2: PM2 (Recommended for VPS)

1. **Install PM2 globally:**
```bash
npm install -g pm2
```

2. **Create PM2 ecosystem file:**
```bash
# Create ecosystem.config.js in project root
```

3. **Start with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 3: Docker Deployment

1. **Build Docker image:**
```bash
docker build -t ecommerce-app .
```

2. **Run container:**
```bash
docker run -p 5000:5000 -e NODE_ENV=production ecommerce-app
```

## 🔧 Server Configuration

### Nginx Reverse Proxy (Recommended)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Logs

### PM2 Monitoring
```bash
pm2 monit          # Real-time monitoring
pm2 logs           # View logs
pm2 restart all    # Restart all processes
```

### Log Files
- Application logs: Check PM2 logs or server console
- Nginx logs: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Update CORS origins for your domain
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall (allow only necessary ports)
- [ ] Regular security updates
- [ ] Database security (if using external DB)
- [ ] Environment variables secured
- [ ] Remove development dependencies

## 🚨 Troubleshooting

### Common Issues

1. **Build fails:**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall
   - Check for missing dependencies

2. **Server won't start:**
   - Check port availability
   - Verify environment variables
   - Check file permissions

3. **Static files not loading:**
   - Verify build directory exists
   - Check server static file configuration
   - Ensure correct paths in production

4. **API calls failing:**
   - Check CORS configuration
   - Verify API endpoints
   - Check network connectivity

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor server resources
- Database optimization (if applicable)

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all configuration steps were completed
4. Test locally first before deploying

## 🔄 Updates

To update the application:
1. Pull latest changes
2. Run `node build.js` again
3. Restart the server: `pm2 restart all` or restart your process

---

**Note**: This application uses in-memory storage for demo purposes. For production, consider implementing a proper database solution.

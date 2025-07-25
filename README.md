# BlogSpace - Modern Blog Platform

A full-featured blog platform built with Next.js, featuring user authentication, photo uploads, and a modern UI.

## Features

- 🔐 **Authentication**: Email/password login and Google OAuth
- 📝 **Post Creation**: Rich text editor with image uploads
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 💬 **Chat Widget**: Integrated chatbot support
- 🗄️ **Database**: SQLite with Prisma ORM
- 🚀 **CI/CD**: Automated deployment with GitHub Actions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Database**: SQLite, Prisma
- **Deployment**: Ubuntu 22.04 EC2, PM2, Nginx

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/blog-app.git
   cd blog-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Update `.env.local` with your values:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## Deploy to EC2 Ubuntu 22.04

### Prerequisites

- AWS EC2 instance running Ubuntu 22.04
- Domain name (optional but recommended)
- SSH key pair for EC2 access

### 1. Launch EC2 Instance

- **AMI**: Ubuntu Server 22.04 LTS
- **Instance Type**: t3.micro (or larger)
- **Security Groups**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Storage**: 20GB+ recommended

### 2. Initial Server Setup

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Copy setup script to server
scp -i your-key.pem scripts/setup-server.sh ubuntu@your-ec2-ip:~/

# Run setup script
chmod +x setup-server.sh
./setup-server.sh
```

### 3. Configure Environment Variables

Create production environment file on server:
```bash
sudo nano /var/www/blog-app/.env.local
```

Add production values:
```
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL="file:./prisma/prod.db"
```

### 4. Update Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/blog-app
```

Replace `your-domain.com` with your actual domain.

### 5. Set Up GitHub Actions CI/CD

1. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
   ```
   EC2_HOST=your-ec2-public-ip
   EC2_USER=ubuntu
   EC2_SSH_KEY=your-private-ssh-key-content
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-production-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL=file:./prisma/prod.db
   ```

2. **Update deployment script** in `.github/workflows/deploy.yml`:
   - Replace repository URL with your GitHub repo

3. **Push to main branch** to trigger deployment:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

### 6. SSL Certificate (Optional)

Set up free SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Production Management

### PM2 Commands
```bash
# Check app status
pm2 status

# View logs
pm2 logs blog-app

# Restart app
pm2 restart blog-app

# Stop app
pm2 stop blog-app
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### Database Management
```bash
# Access production database
cd /var/www/blog-app
npx prisma studio

# Run migrations
npx prisma db push
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**:
   ```bash
   sudo lsof -i :3000
   pm2 restart blog-app
   ```

2. **Database connection issues**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Nginx configuration errors**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Permission issues**:
   ```bash
   sudo chown -R ubuntu:ubuntu /var/www/blog-app
   ```

### Logs
- **Application logs**: `pm2 logs blog-app`
- **Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
- **System logs**: `sudo journalctl -u nginx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open a GitHub issue or contact the development team.

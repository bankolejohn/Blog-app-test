#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Create application directory
sudo mkdir -p /var/www/blog-app
sudo chown -R $USER:$USER /var/www/blog-app

# Clone repository (replace with your repo URL)
cd /var/www
git clone https://github.com/YOUR_USERNAME/blog-app.git
cd blog-app

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Create production database
npx prisma db push

# Build application
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/blog-app > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/blog-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start application with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

echo "Setup complete! Your blog app should be running on port 80"
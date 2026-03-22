# College Event Portal (EventHub)

A modern, responsive web application for managing college events, built with a Vanilla Glassmorphism frontend and a secure Node.js/SQLite backend.

## Ubuntu Setup & Deployment Instructions

To instantly download and run this application on your college's Ubuntu PC, run the following commands sequentially in your terminal:

```bash
sudo apt update
sudo apt install nodejs npm -y
git clone https://github.com/ftjithin12/college-level-event-portal.git
cd college-level-event-portal
npm install
node server.js
```

Once the terminal says **"Server is running"**, open your web browser and go to your local application link:
`http://localhost:5000`

*(Note: Use `http://` instead of `https://` since the local development server does not use an SSL certificate).*

### Using the App
- **Default Admin Username:** `admin`
- **Default Admin Password:** `admin123`
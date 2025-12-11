# 🚀 Quick Start Guide

## Start the Application in 3 Steps

### Step 1: Start the WebSocket Server
```bash
# Navigate to the kabaw-sockets directory
cd path/to/kabaw-sockets
go run main.go
```
Expected output:
```
Server starting on port :8080
```

### Step 2: Start the React App
```bash
# In a new terminal, navigate to this directory
cd path/to/kabaw-chat-app
npm run dev
```
Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 3: Open in Browser
Open your browser and go to: `http://localhost:3000`

## First Time Setup

Only need to do this once:

```bash
# Clone the repository
git clone <your-repo-url>
cd kabaw-chat-app

# Install dependencies
npm install
```

## Usage

1. **Enter your username** (e.g., "John")
2. **Enter channel name** (use "general" to see simulated messages)
3. **Click "Connect to Chat"**
4. **Start chatting!**

## Tips

- Press **Enter** to send messages quickly
- Open multiple browser tabs to simulate multiple users
- Check the browser console (F12) for detailed logs
- The "general" channel has simulated bot messages every 10 seconds

## Troubleshooting

**Can't connect?**
- Make sure the Go server is running first
- Check: `curl http://localhost:8080/health`
- Should return: `{"service":"kabaw-discord-server","status":"ok"}`

**Port already in use?**
- Change the port in `vite.config.js`
- Or stop the process using port 3000

## Need Help?

See the full documentation in `README.md`

---

**Happy Chatting! 💬**

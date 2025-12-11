# Kabaw Chat Application

A modern, real-time WebSocket chat application built with React for the Kabaw AI technical evaluation.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-Protocol-010101?style=for-the-badge&logo=socket.io&logoColor=white)

## 🎯 Project Overview

This React application is a technical evaluation submission that demonstrates:
- Real-time WebSocket communication
- Modern React hooks and custom hooks
- Clean component architecture
- Responsive UI design
- Proper error handling and reconnection logic

## 📸 Application Preview

### Login Screen
![Kabaw Chat Login](./screenshots/app-screenshot.png)
*Modern chat application with real-time WebSocket communication*

> **Note**: The application features a clean login interface, real-time messaging, connection status indicators, and full responsive design.

## ✨ Features

### Core Functionality
- ✅ **WebSocket Connection Management** - Connect/disconnect with automatic reconnection
- ✅ **Real-time Messaging** - Instant message delivery and display
- ✅ **User Identification** - Unique user ID assignment and tracking
- ✅ **Channel Support** - Join different chat channels
- ✅ **Message Types** - Support for regular, system, and user connection messages
- ✅ **Connection Status** - Visual indicator for connection state

### User Experience
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⌨️ **Keyboard Support** - Press Enter to send messages
- 🔄 **Auto-scroll** - Automatically scrolls to latest messages
- 💬 **Message Display** - Different styling for own vs. others' messages
- ⏰ **Timestamps** - Display message send time
- 🆔 **User ID Display** - Shows abbreviated user IDs with full ID on hover

### Technical Features
- 🔌 **Custom WebSocket Hook** - Reusable hook for WebSocket management
- 🔁 **Automatic Reconnection** - Exponential backoff strategy (max 5 attempts)
- 📊 **Console Logging** - Detailed logs for debugging (check browser console)
- ⚠️ **Error Handling** - Graceful error messages and connection failure handling
- 🧹 **Cleanup** - Proper resource cleanup on component unmount

## 📁 Project Structure

```
kabaw-chat-app/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatRoom.jsx         # Main chat interface component
│   │   ├── ChatRoom.css         # Chat room styling
│   │   ├── MessageItem.jsx      # Individual message component
│   │   └── MessageItem.css      # Message item styling
│   ├── hooks/
│   │   └── useWebSocket.js      # Custom WebSocket hook
│   ├── App.jsx                  # Root application component
│   ├── index.css                # Global styles
│   └── main.jsx                 # Application entry point
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js**: v18.0.0 or higher ([Download here](https://nodejs.org/))
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Go**: v1.21 or higher (for running the WebSocket server)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd kabaw-chat-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `react` & `react-dom` - React framework
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite

### Step 3: Start the WebSocket Server

Before running the React app, you need to start the Kabaw WebSocket server.

Navigate to the server directory and run:

```bash
cd path/to/kabaw-sockets
go run main.go
```

You should see:
```
Server starting on port :8080
```

### Step 4: Start the React Application

In a new terminal, from the `kabaw-chat-app` directory:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎮 How to Use

### Connecting to Chat

1. **Enter Username**: Type your desired username
2. **Enter Channel**: Type the channel name (default: "general")
3. **Click "Connect to Chat"**: Establishes WebSocket connection

### Sending Messages

1. Type your message in the input field at the bottom
2. Press **Enter** or click the **Send** button
3. Your message will appear on the right side (own messages)
4. Other users' messages appear on the left side

### Disconnecting

Click the **Disconnect** button in the header to close the WebSocket connection.

## 🔧 Technical Implementation

### WebSocket Connection

The application connects to the server at:
```javascript
ws://localhost:8080/ws?username=YourName&channel=general
```

### Message Format

**Sent messages (Client → Server):**
```json
{
  "type": "message",
  "content": "Hello, world!"
}
```

**Received messages (Server → Client):**
```json
{
  "type": "message",
  "username": "JohnDoe",
  "user_id": "a1b2c3d4e5f6789012345678",
  "content": "Hello, world!",
  "timestamp": "2025-12-11T10:30:00Z",
  "channel": "general"
}
```

### Custom Hook: useWebSocket

The `useWebSocket` hook manages all WebSocket functionality:

```javascript
const {
  messages,           // Array of received messages
  connectionStatus,   // 'connecting' | 'connected' | 'disconnected'
  currentUserID,      // User's unique ID from server
  error,              // Error message (if any)
  connect,            // Function to establish connection
  disconnect,         // Function to close connection
  sendMessage         // Function to send messages
} = useWebSocket(url, username, channel);
```

### Reconnection Strategy

The app uses exponential backoff for reconnection:
- Attempt 1: 2 seconds delay
- Attempt 2: 4 seconds delay
- Attempt 3: 8 seconds delay
- Attempt 4: 16 seconds delay
- Attempt 5: 32 seconds delay (capped at 10 seconds)

After 5 failed attempts, the user must refresh the page.

## 🐛 Debugging

### Browser Console Logs

Open Developer Tools (F12) and check the Console tab for detailed logs:

```
[FRONTEND-CONNECT] Attempting to connect to: ws://localhost:8080/ws?...
[FRONTEND-CONNECT] Connected to WebSocket as TestUser in channel general
[FRONTEND-USER-ID] Assigned user ID: a1b2c3d4...
[FRONTEND-MESSAGE] { "type": "message", "content": "Hello!" }
[FRONTEND-SEND] { "type": "message", "content": "My message" }
```

### Common Issues

**1. Connection Refused**
- Make sure the Go WebSocket server is running on port 8080
- Check: `curl http://localhost:8080/health`

**2. CORS Issues**
- The server is configured to allow all origins
- React app can run on any port (default: 3000)

**3. Messages Not Appearing**
- Check browser console for WebSocket errors
- Verify the server is receiving messages (check server console)
- Ensure you're connected (green "Connected" status)

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## 🎨 Technologies Used

- **React 18.2** - UI framework with hooks
- **Vite 5.0** - Fast build tool and dev server
- **WebSocket API** - Native browser WebSocket implementation
- **CSS3** - Modern styling with flexbox, grid, and animations
- **JavaScript ES6+** - Modern JavaScript features

## 📊 Code Quality

### Features Implemented
- ✅ Clean component architecture
- ✅ Custom hooks for reusability
- ✅ Proper state management
- ✅ Error boundaries and error handling
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Performance optimization (auto-scroll, memoization)
- ✅ Comprehensive documentation

### Best Practices
- Separation of concerns (components, hooks, styles)
- Descriptive variable and function names
- Inline code comments for complex logic
- Proper cleanup of resources
- Defensive programming (error checks)

## 🧪 Testing

To test the application:

1. **Single User Test**:
   - Connect with a username
   - Send messages and verify they appear
   - Check console logs

2. **Multiple Users Test**:
   - Open multiple browser tabs
   - Connect with different usernames
   - Send messages from different tabs
   - Verify all users see all messages

3. **Reconnection Test**:
   - Connect to chat
   - Stop the Go server
   - Observe reconnection attempts
   - Restart server and verify reconnection

4. **Simulated Messages Test**:
   - Connect to "general" channel
   - Wait for simulated bot messages (every 10 seconds)
   - Verify they appear correctly

## 🤝 Implementation Approach

### Development Timeline (Estimated)

| Task | Time | Status |
|------|------|--------|
| Project setup & configuration | 30 min | ✅ Complete |
| WebSocket custom hook | 1 hour | ✅ Complete |
| Chat UI components | 1.5 hours | ✅ Complete |
| Styling & responsive design | 1 hour | ✅ Complete |
| Testing & debugging | 45 min | ✅ Complete |
| Documentation | 45 min | ✅ Complete |
| **Total** | **~5.5 hours** | ✅ Complete |

### Challenges & Solutions

**Challenge 1: WebSocket reconnection logic**
- Solution: Implemented exponential backoff with max attempts

**Challenge 2: Message display for own vs. others**
- Solution: Used user ID comparison to determine message ownership

**Challenge 3: Auto-scrolling to new messages**
- Solution: Used ref to track message container bottom and scrollIntoView

**Challenge 4: Responsive design across devices**
- Solution: Mobile-first approach with flexible layouts and media queries

## 🔮 Alternative Solutions

If the current implementation doesn't meet specific requirements, here are alternative approaches:

1. **State Management**: Could use Redux or Zustand for more complex state
2. **Styling**: Could use Tailwind CSS or Material-UI for faster development
3. **TypeScript**: Could add type safety with TypeScript
4. **Testing**: Could add Jest and React Testing Library
5. **Advanced Features**: Could add file uploads, emoji pickers, user avatars

## 📄 License

This project is created for educational and evaluation purposes.

## 👤 Author

Created as part of the Kabaw AI technical evaluation.

---

**🚀 Ready to Chat!**

For questions or issues, please check the console logs and ensure the WebSocket server is running properly.

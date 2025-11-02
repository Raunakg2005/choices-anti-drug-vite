# Anti-Drug Awareness Platform

A comprehensive MERN stack application promoting drug awareness and recovery support through interactive features including forums, meetings, resources, and an AI-powered educational game.

## Features

- 🎮 **Dynamic Game**: Interactive 4-stage story game with AI-generated or pre-written narratives
- 💬 **Community Forum**: Share experiences and support others
- 📅 **Meetings & Resources**: Find AA meetings and recovery resources
- 🏆 **Pledge Certificate**: Get certified for your commitment
- 🎯 **VR Experience**: Immersive awareness activities
- 🔐 **User Authentication**: Secure login and registration

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Modern CSS with animations

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Google Gemini AI (optional)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key (optional - see setup below)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd choices-anti-drug-vite
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd server
npm install
```

4. **Setup Environment Variables**
```bash
# In the server folder, copy .env.example to .env
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anti-drug-db
JWT_SECRET=your_secure_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here  # Optional
NODE_ENV=development
```

5. **Test Your Gemini API Key (Optional)**
```bash
# In the server folder
node testGemini.js
```

6. **Start the Application**

Terminal 1 - Backend:
```bash
cd server
node server.js
```

Terminal 2 - Frontend:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Google Gemini AI Setup (Optional)

The Dynamic Game feature can use Google's Gemini AI to generate personalized stories. **This is optional** - the game will use professionally written fallback stories if no API key is provided.

### Getting Your Free API Key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### Test Your API Key:
```bash
cd server
node testGemini.js
```

For detailed setup instructions, see [server/GEMINI_SETUP.md](server/GEMINI_SETUP.md)

### With vs Without API Key:

| Feature | With Gemini AI | Without (Fallback) |
|---------|---------------|-------------------|
| Story Generation | ✅ AI-generated, personalized | ✅ Pre-written templates |
| Personalization | ✅ Uses name, age, interests | ✅ Age-appropriate stories |
| Variety | ✅ Unique every time | ✅ Multiple story paths |
| Setup Required | ⚠️ Need API key | ✅ Works immediately |

## Project Structure

```
choices-anti-drug-vite/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   │   ├── Home/
│   │   ├── Forum/
│   │   ├── Meetings/
│   │   ├── DynamicGame/
│   │   └── ...
│   ├── context/           # React Context (Auth)
│   └── utils/             # Utility functions
├── server/
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── services/         # External services (scraper)
│   ├── testGemini.js    # API key tester
│   └── GEMINI_SETUP.md  # Detailed AI setup guide
└── public/               # Static assets
```

## Available Routes

- `/` - Landing page
- `/home` - Main dashboard
- `/about` - About the platform
- `/forum` - Community forum
- `/meetings` - Support meetings & resources
- `/dynamic-game` - AI-powered interactive game
- `/pledge` - Pledge certificate
- `/vr-game` - VR experience
- `/login` - User login
- `/signup` - User registration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Forum
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like a post

### Game
- `POST /api/game/session` - Create game session
- `POST /api/game/story` - Generate story stage
- `GET /api/game/session/:id` - Get game session

### Resources
- `GET /api/resources` - Get resources
- `POST /api/resources/refresh` - Refresh scraped data

## Troubleshooting

### "API key not valid" Error
The game will automatically use fallback stories. To fix:
1. Get a new API key from https://makersuite.google.com/app/apikey
2. Update your `.env` file
3. Run `node testGemini.js` to verify
4. Restart the server

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For Atlas, ensure IP whitelist is configured

### Port Already in Use
Change the `PORT` in `.env` file to a different number

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the [GEMINI_SETUP.md](server/GEMINI_SETUP.md) for AI setup
- Review the console logs for errors
- Open an issue on GitHub

---

**Note:** This platform is designed for educational and support purposes. If you or someone you know is struggling with substance abuse, please reach out to professional help:
- SAMHSA National Helpline: 1-800-662-4357
- 988 Suicide & Crisis Lifeline: 988

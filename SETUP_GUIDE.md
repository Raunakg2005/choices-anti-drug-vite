# SETUP GUIDE - Anti-Drug Awareness Platform

## Complete Installation Instructions

### Step 1: Install Dependencies

#### Frontend Dependencies
```powershell
# In the root directory (choices-anti-drug-vite)
npm install
```

#### Backend Dependencies
```powershell
# Navigate to server directory
cd server
npm install
cd ..
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
```powershell
# Start MongoDB (if installed as service)
net start MongoDB

# OR run mongod directly
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in server/.env

### Step 3: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the API key for use in .env file

### Step 4: Configure Environment Variables

#### Frontend Environment (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend Environment (server/.env)
Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anti-drug-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

**IMPORTANT**: 
- Replace `JWT_SECRET` with a random secure string
- Replace `GEMINI_API_KEY` with your actual Gemini API key
- If using MongoDB Atlas, replace `MONGODB_URI` with your connection string

### Step 5: Start the Application

#### Terminal 1 - Backend Server
```powershell
cd server
npm run dev
```
Server should start on http://localhost:5000

#### Terminal 2 - Frontend Development Server
```powershell
# In root directory
npm run dev
```
Frontend should start on http://localhost:5173

### Step 6: Verify Installation

1. Open browser and go to http://localhost:5173
2. You should see the home page
3. Try creating an account (Sign Up)
4. Login with your credentials
5. Test the Dynamic Game (requires login)
6. Test the Forum (create a post)

### Troubleshooting

#### MongoDB Connection Issues
- Ensure MongoDB is running
- Check if the connection string is correct
- For MongoDB Atlas, whitelist your IP address

#### Port Already in Use
```powershell
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change PORT in server/.env to a different number
```

#### Module Not Found Errors
```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install

# For server
cd server
rm -r node_modules
npm install
```

#### Gemini API Errors
- Verify your API key is correct
- Check if you have API quota remaining
- Ensure you're using the correct API endpoint

### Production Build

#### Build Frontend
```powershell
npm run build
```

#### Start Production Server
```powershell
cd server
# Set NODE_ENV=production in .env
npm start
```

### Additional Features to Test

1. **Authentication**
   - Sign up with new account
   - Login with credentials
   - Logout functionality

2. **Dynamic Game**
   - Login required
   - Enter name, age, interests
   - Play through 4 stages
   - Make choices and see score

3. **Forum**
   - Browse posts (no login needed)
   - Create post (login required)
   - Comment on posts (login required)
   - Like posts (login required)

4. **Static Game**
   - Available without login
   - Story-based journey through life stages

### Default Test Account (Optional)

You can create a test account:
- Username: testuser
- Email: test@example.com
- Password: test123

### Next Steps

1. Customize the branding and colors
2. Add more game stages
3. Implement profile pages
4. Add email verification
5. Deploy to production (Vercel for frontend, Render/Railway for backend)

### Support

For issues or questions:
- Check the README.md file
- Review the API documentation
- Check console logs for errors

---

**Remember**: Never commit your `.env` files to version control!

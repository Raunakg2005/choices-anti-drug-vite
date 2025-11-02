# Google Gemini AI Setup Guide

## Getting Your Gemini API Key

The Dynamic Game feature uses Google's Gemini AI to generate personalized anti-drug awareness stories. Follow these steps to get your free API key:

### Step 1: Access Google AI Studio
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create an API Key
1. Click on **"Get API Key"** or **"Create API Key"**
2. Select **"Create API key in new project"** (or use an existing project)
3. Your API key will be generated immediately
4. **Copy the API key** - you'll need it for the next step

### Step 3: Add the API Key to Your Project
1. Open the `.env` file in the `server` folder
2. Find the line: `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key
4. Save the file

Example:
```env
GEMINI_API_KEY=AIzaSyC_YourActualKeyHere_aBcDeFgHiJkLmNo
```

### Step 4: Restart Your Server
After adding the API key, restart your server:
```bash
cd server
node server.js
```

## Important Notes

### Free Tier Limits
- Gemini API offers a generous free tier
- 60 requests per minute
- Sufficient for personal projects and testing

### Fallback System
**Good news!** Even without an API key, the game will still work:
- The system uses pre-written story templates as fallback
- Stories are age-appropriate and engaging
- Three age categories: child (< 13), teen (13-17), adult (18+)
- Multiple story paths based on user choices
- Full 4-stage game experience

### Security Best Practices
1. **Never commit** your `.env` file to Git
2. **Never share** your API key publicly
3. Use the `.env.example` file as a template
4. Regenerate your key if accidentally exposed

## Troubleshooting

### Error: "API key not valid"
- Check that you copied the entire API key
- Ensure there are no extra spaces or quotes
- Verify the key is active in Google AI Studio
- Try generating a new API key

### Error: "Quota exceeded"
- You've exceeded the free tier limit
- Wait a few minutes and try again
- Consider upgrading if needed

### Game still works but uses fallback stories
- This is normal if no API key is provided
- Fallback stories are professionally written
- To use AI-generated stories, add your API key

## API Key Features

### With Gemini AI:
✅ Personalized stories based on user's name, age, and interests
✅ Dynamic narrative that adapts to choices
✅ Unique experience every time
✅ Creative and engaging scenarios

### Without API Key (Fallback):
✅ Age-appropriate pre-written stories
✅ Multiple story paths
✅ Educational and engaging content
✅ Full game functionality
✅ No setup required

## Support

If you encounter issues:
1. Check the server console for error messages
2. Verify your API key is correct
3. Ensure you have internet connection
4. Try the fallback mode (remove or leave API key empty)

For more information, visit:
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)

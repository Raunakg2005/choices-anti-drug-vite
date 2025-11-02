import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGeminiAPI() {
  console.log('\n🔍 Testing Gemini API Key...\n');

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('❌ No API key found in .env file');
    console.log('\n📝 To get a Gemini API key:');
    console.log('1. Visit: https://makersuite.google.com/app/apikey');
    console.log('2. Sign in with your Google account');
    console.log('3. Click "Create API Key"');
    console.log('4. Copy the key and add it to your .env file');
    console.log('\n💡 Note: The game will use fallback stories without an API key');
    return;
  }

  console.log('✓ API key found in .env file');
  console.log('Key preview:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names (v1beta models)
    const modelsToTry = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let success = false;
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`🚀 Testing model: ${modelName}...\n`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Write a single sentence about hope.');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Your API key is working!\n');
        console.log(`✓ Working model: ${modelName}`);
        console.log('Test response:', text);
        console.log('\n🎮 Your game will now use AI-generated stories!\n');
        success = true;
        break;
      } catch (modelError) {
        console.log(`✗ Model ${modelName} failed:`, modelError.message.split('\n')[0]);
      }
    }
    
    if (!success) {
      throw new Error('All model names failed');
    }

  } catch (error) {
    console.log('❌ API KEY ERROR:', error.message);
    console.log('\n📝 How to fix:');
    console.log('1. Visit: https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Update your .env file with the new key');
    console.log('4. Run this test again: node testGemini.js');
    console.log('\n💡 The game will use fallback stories until the API key is fixed\n');
  }
}

testGeminiAPI();

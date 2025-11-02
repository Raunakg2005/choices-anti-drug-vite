import { GoogleGenerativeAI } from '@google/generative-ai';
import GameSession from '../models/GameSession.js';
import User from '../models/User.js';

// Lazy initialization of Gemini AI
let genAI = null;
let isInitialized = false;

function initializeGeminiAI() {
  if (isInitialized) return genAI;
  
  isInitialized = true;
  const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, '');
  
  console.log('Initializing Gemini AI...');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  
  if (apiKey && apiKey.length > 0) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error.message);
    }
  } else {
    console.log('⚠️ No API key found, will use fallback stories');
  }
  
  return genAI;
}

// Fallback story templates
const storyTemplates = {
  1: {
    child: {
      story: "You're at a friend's birthday party. An older kid offers you a colorful pill, saying it'll make the party more fun. Your best friend looks worried and whispers that you should stay away from it. Everyone's watching to see what you'll do.",
      choice1: "Take the pill to fit in with the older kids",
      choice2: "Politely refuse and stick with your best friend"
    },
    teen: {
      story: "At a weekend party, someone passes around a vape pen filled with something stronger than nicotine. Your friends are pressuring you to try it, saying 'everyone does it.' Your gut tells you this isn't right, but you don't want to seem uncool.",
      choice1: "Take a hit to avoid being called out",
      choice2: "Say no and suggest leaving the party"
    },
    adult: {
      story: "You've been working overtime for months, feeling exhausted. A coworker offers you prescription pills, claiming they help with energy and focus. They say the doctor gives them out like candy. You're tempted but know this could be dangerous.",
      choice1: "Take the pills to keep up with work demands",
      choice2: "Decline and talk to your doctor about healthy solutions"
    }
  },
  2: {
    goodPath: {
      story: "Your decision to refuse paid off. Your true friends respect your choice and one even admits they were relieved you said no. You feel proud and confident. Later, you hear that the substance made several people sick. You're invited to join a community sports team where you meet supportive people.",
      choice1: "Skip the team and hang with the party crowd",
      choice2: "Join the team and build healthy friendships"
    },
    badPath: {
      story: "After using the substance, you feel sick and anxious. Your grades are slipping, and your family has noticed changes in your behavior. A friend who genuinely cares about you confronts you, offering to help you get support. You're at a crossroads.",
      choice1: "Push your friend away and continue using",
      choice2: "Accept help and talk to a counselor"
    }
  },
  3: {
    goodPath: {
      story: "Joining the team changed your life. You've made genuine friends, improved your health, and discovered new passions. A younger person looks up to you and asks for advice about peer pressure. You have a chance to make a real difference in someone else's life.",
      choice1: "Tell them everyone experiments, it's no big deal",
      choice2: "Share your story and guide them toward good choices"
    },
    badPath: {
      story: "With help, you're three weeks clean. It's hard, but you're seeing a counselor and attending support groups. You run into old friends who are still using. They mock your recovery and offer you 'one last time.' Your counselor's words echo: 'Recovery is a choice you make every day.'",
      choice1: "Give in to the temptation one more time",
      choice2: "Walk away and call your support person"
    }
  },
  4: {
    bestEnding: {
      story: "Years later, you're thriving. By choosing health and honesty, you've built a life you're proud of. You now mentor youth in your community, helping them avoid the mistakes others made. Your story inspires others to make better choices. You've proven that one good decision can change everything.",
      choice1: "Reflect on your journey with gratitude",
      choice2: "Continue helping others find their path"
    },
    goodEnding: {
      story: "Your recovery journey has been challenging, but you made it. One year clean, you've rebuilt relationships and discovered your strength. You share your story at a recovery meeting, helping others see that it's never too late to change. Every day clean is a victory.",
      choice1: "Celebrate your progress and stay committed",
      choice2: "Become a sponsor to help others recover"
    },
    badEnding: {
      story: "The choices you made led to serious consequences. You've lost trust, opportunities, and your health has suffered. But in this dark moment, you realize it's not too late. A counselor offers you a path forward: treatment, support, and hope. The question is: are you ready to choose differently?",
      choice1: "Accept help and begin recovery now",
      choice2: "Commit to changing your life today"
    }
  }
};

function getAgeCategory(age) {
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  return 'adult';
}

function getFallbackStory(stageNumber, userAge, previousChoices = []) {
  const ageCategory = getAgeCategory(userAge);
  
  if (stageNumber === 1) {
    return storyTemplates[1][ageCategory];
  }
  
  if (stageNumber === 4) {
    const goodChoices = previousChoices.filter(c => c === 2).length;
    if (goodChoices === 3) return storyTemplates[4].bestEnding;
    if (goodChoices >= 2) return storyTemplates[4].goodEnding;
    return storyTemplates[4].badEnding;
  }
  
  // Stages 2 and 3
  const lastChoice = previousChoices[previousChoices.length - 1];
  const path = lastChoice === 2 ? 'goodPath' : 'badPath';
  return storyTemplates[stageNumber][path];
}

export const createGameSession = async (req, res) => {
  try {
    const { userName, userAge, userInterests } = req.body;

    const gameSession = new GameSession({
      user: req.userId,
      userName,
      userAge,
      userInterests: userInterests || ''
    });

    await gameSession.save();

    // Add to user's game sessions
    await User.findByIdAndUpdate(req.userId, {
      $push: { gameSessions: gameSession._id }
    });

    res.status(201).json(gameSession);
  } catch (error) {
    console.error('Create game session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateStory = async (req, res) => {
  try {
    const { sessionId, stageNumber, selectedChoice } = req.body;

    const session = await GameSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (session.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let story, choice1, choice2;
    
    // Get previous choices early for use in image generation
    const previousChoices = session.stages.map(s => s.selectedChoice);

    // Initialize Gemini AI on first use
    const genAI = initializeGeminiAI();

    // Try to use Gemini AI if available
    if (genAI) {
      try {
        let prompt = '';
        
        if (stageNumber === 1) {
          // First stage - personalized introduction
          prompt = `Create an engaging anti-drug awareness story for ${session.userName}, age ${session.userAge}. ${session.userInterests ? `Interests: ${session.userInterests}.` : ''}

Generate Stage 1 of a 4-stage interactive story that:
- Features realistic scenarios about drug exposure or peer pressure appropriate for age ${session.userAge}
- Is personalized and relatable
- Teaches the importance of making good choices
- Has exactly 2 choices where Choice 1 is risky/dangerous and Choice 2 is safe/wise
- Story: 80-120 words, engaging and descriptive
- Each choice: 12-18 words, clear and distinct

IMPORTANT: Format your response EXACTLY as shown below (use these exact labels):
Story: [Write the story here in 80-120 words]
Choice 1: [Write the risky choice here in 12-18 words]
Choice 2: [Write the safe choice here in 12-18 words]`;
        } else {
          // Subsequent stages
          const previousStage = session.stages[stageNumber - 2];
          const choiceMade = selectedChoice === 1 ? 'the risky choice (Choice 1)' : 'the safe choice (Choice 2)';
          
          prompt = `Continue the anti-drug awareness story for ${session.userName}, age ${session.userAge}.

PREVIOUS STAGE (Stage ${stageNumber - 1}):
Story: ${previousStage.story}
Choice 1: ${previousStage.choice1}
Choice 2: ${previousStage.choice2}

The user chose ${choiceMade}.

Generate Stage ${stageNumber} of 4 that:
${stageNumber === 4 ? '- Provides a meaningful CONCLUSION showing the consequences of all their choices' : '- Shows realistic consequences of their previous decision'}
- Continues the narrative naturally from their choice
- ${stageNumber === 4 ? 'Delivers a powerful message about drug awareness and life choices' : 'Presents a new challenge or situation'}
- Has exactly 2 choices where Choice 1 is risky/dangerous and Choice 2 is safe/wise
- Story: 80-120 words
- Each choice: 12-18 words

IMPORTANT: Format your response EXACTLY as shown below:
Story: [Write the story here in 80-120 words]
Choice 1: [Write the risky choice here in 12-18 words]
Choice 2: [Write the safe choice here in 12-18 words]`;
        }

        // Generate story with Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const storyText = response.text();

        console.log('Gemini response:', storyText);

        // Parse the response with improved regex
        const storyMatch = storyText.match(/Story:\s*(.+?)(?=\n\s*Choice 1:|Choice 1:|$)/is);
        const choice1Match = storyText.match(/Choice 1:\s*(.+?)(?=\n\s*Choice 2:|Choice 2:|$)/is);
        const choice2Match = storyText.match(/Choice 2:\s*(.+?)(?=\n|$)/is);

        story = storyMatch ? storyMatch[1].trim() : '';
        choice1 = choice1Match ? choice1Match[1].trim() : '';
        choice2 = choice2Match ? choice2Match[1].trim() : '';

        // Validate parsed content
        if (!story || story.length < 50 || !choice1 || !choice2) {
          throw new Error('Invalid story format from AI');
        }

      } catch (aiError) {
        console.error('Gemini AI error, using fallback:', aiError.message);
        // Use fallback story
        const fallback = getFallbackStory(stageNumber, session.userAge, previousChoices);
        story = fallback.story;
        choice1 = fallback.choice1;
        choice2 = fallback.choice2;
      }
    } else {
      // No API key, use fallback stories
      console.log('Using fallback story (no API key)');
      const fallback = getFallbackStory(stageNumber, session.userAge, previousChoices);
      story = fallback.story;
      choice1 = fallback.choice1;
      choice2 = fallback.choice2;
    }

    // Split story into sentences to generate multiple images
    const sentences = story.split(/(?<=[.!?])\s+/).filter(s => s.trim());
    const imageUrls = [];

    // Generate AI-powered images using Gemini - one for each sentence
    if (genAI) {
      try {
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          
          // Use Gemini to generate a detailed image description
          const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
          const imagePrompt = `Generate a detailed, vivid image description for this scene in an anti-drug awareness story: "${sentence}"

Create a realistic, educational image description that captures:
- The exact setting and environment described
- Key visual elements and objects mentioned (like vape pens, pills, people, etc.)
- The mood and emotional tone
- Age-appropriate but impactful imagery for anti-drug education
- 16:9 widescreen composition

Respond with ONLY a detailed image description (2-3 sentences), nothing else.`;
          
          const imageResult = await imageModel.generateContent(imagePrompt);
          const imageResponse = await imageResult.response;
          const imageDescription = imageResponse.text().trim();
          
          console.log(`\n📸 Image ${i + 1} Description for: "${sentence}"`);
          console.log(`Description: ${imageDescription}\n`);
          
          // For now, we'll use the description as a base64 data URL placeholder
          // In production, you would send this to DALL-E, Midjourney, or Stable Diffusion
          // For demonstration, we'll create a gradient with text overlay
          const encodedDesc = encodeURIComponent(imageDescription.substring(0, 100));
          
          // Using DiceBear API to generate abstract art based on description
          // Or use Pollinations.ai which is free and generates images from text
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedDesc}?width=1600&height=900&seed=${stageNumber + i}&nologo=true`;
          
          imageUrls.push(imageUrl);
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (imageError) {
        console.error('Image generation error, using fallback:', imageError.message);
        // Fallback: generate thematic seeds for each sentence
        const fallbackSeeds = ['choice', 'decision', 'crossroads', 'future', 'hope', 'struggle', 'victory', 'challenge', 'path'];
        for (let i = 0; i < sentences.length; i++) {
          const seedIndex = (stageNumber + i + (previousChoices.filter(c => c === 2).length)) % fallbackSeeds.length;
          imageUrls.push(`https://picsum.photos/seed/${fallbackSeeds[seedIndex]}${stageNumber}${i}/1600/900`);
        }
      }
    } else {
      // No AI available, use basic thematic images with stage-based seeds - 16:9 aspect ratio
      for (let i = 0; i < sentences.length; i++) {
        const imageId = 100 + stageNumber + (previousChoices.filter(c => c === 2).length * 10) + i;
        imageUrls.push(`https://picsum.photos/seed/${imageId}/1600/900`);
      }
    }

    // Use first image as primary (for backward compatibility)
    const generatedImage = imageUrls[0] || `https://picsum.photos/seed/${stageNumber}/1600/900`;

    // Save stage to session
    session.stages.push({
      stageNumber,
      story,
      choice1,
      choice2,
      selectedChoice: selectedChoice || 0,
      generatedImage
    });

    // Update score based on choices
    if (selectedChoice === 2) {
      session.score += 25; // Good choice
    }

    if (stageNumber === 4) {
      session.completed = true;
    }

    await session.save();

    res.json({
      story,
      choice1,
      choice2,
      generatedImage,
      imageUrls, // Array of images for each sentence
      stageNumber,
      score: session.score,
      completed: session.completed
    });
  } catch (error) {
    console.error('Generate story error:', error);
    res.status(500).json({ 
      message: 'Error generating story', 
      error: error.message 
    });
  }
};

export const getGameSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid session ID format' });
    }
    
    const session = await GameSession.findById(id);
    
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    if (session.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get game session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserGameSessions = async (req, res) => {
  try {
    const sessions = await GameSession.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(sessions);
  } catch (error) {
    console.error('Get user game sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (genAI) {
      try {
        // Using Gemini to generate image description
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(
          `Create a detailed visual description for an educational anti-drug awareness image based on: ${prompt}. The description should be suitable for image generation AI.`
        );
        
        const response = await result.response;
        const description = response.text();

        // Placeholder image URL (in production, use actual image generation)
        const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`;

        res.json({
          imageUrl,
          description
        });
      } catch (aiError) {
        console.error('Gemini error in image generation:', aiError.message);
        // Fallback to basic image
        const imageUrl = `https://source.unsplash.com/800x600/?awareness,support`;
        res.json({
          imageUrl,
          description: 'Educational anti-drug awareness image'
        });
      }
    } else {
      // No API key, use fallback
      const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`;
      res.json({
        imageUrl,
        description: 'Educational image representing: ' + prompt
      });
    }
  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ message: 'Error generating image' });
  }
};

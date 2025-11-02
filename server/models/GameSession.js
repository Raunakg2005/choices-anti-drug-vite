import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAge: {
    type: Number,
    required: true
  },
  userInterests: {
    type: String,
    default: ''
  },
  stages: [{
    stageNumber: Number,
    story: String,
    choice1: String,
    choice2: String,
    selectedChoice: Number,
    generatedImage: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('GameSession', gameSessionSchema);

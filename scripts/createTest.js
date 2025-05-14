import mongoose from 'mongoose';
import { User , Campaign} from '../models/EmailEvent.js';

// Configure mongoose before any operations
mongoose.set('strictQuery', false);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Verify User model is properly initialized
    if (!User) {
      throw new Error('User model is not properly initialized');
    }
    console.log('User model verified:', User.modelName);

    await mongoose.connect("mongodb+srv://ansh:f6OhEOjptW5zs4GV@testingmongo.ui4dk7f.mongodb.net/?retryWrites=true&w=majority&appName=testingmongo");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test user
const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log("Test user already exists");
      return;
    }

    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      company: 'Test Company', 
      activated: true, 
      class: 'free',
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser);
  
  } catch (error) {
    console.error('Error creating test user:', error);
  } 

};


// function to create a tests campaign 
const createTestCampaign = async () => {
  try {
    const user = await User.findOne({ email: 'test@example.com' });
    const testCampaign = new Campaign({
      user: user._id, 
      name: 'test',
      description: 'test campaign',
    });
    await testCampaign.save();
    console.log('Test campaign created successfully:', testCampaign);
  } catch (error) {
    console.error('Error creating test campaign:', error);
    } 
  };

// Main function to run everything
const main = async () => {
  try {
    await connectDB();
    await createTestUser(); 
    await createTestCampaign();
  } catch (error) {
    console.error('Error in main process:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Execute the main function
main();
mongoose.set('strictQuery', false);

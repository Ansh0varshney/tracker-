import { connectToDatabase } from '../mongodb';

export default async function handler(req, res) {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const conn = await connectToDatabase();
    console.log('MongoDB connection successful');
    
    res.status(200).json({ 
      status: 'Connected to MongoDB successfully!',
      connection: !!conn
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server console for more information'
    });
  }
} 
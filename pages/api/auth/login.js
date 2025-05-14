import { connectToDatabase } from '../../../mongodb';
import { Campaign, User } from '../../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'you have not signed up' });
    }

    // In a real application, you should use proper password hashing
    // For now, we're doing a simple comparison
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Don't send password back to client
    const userWithoutPassword = {
      _id: user._id,
      activated: user.activated,
      name: user.name,
      company: user.company, 
      class: user.class,
      
    };

    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
// File: api/pixel/[emailID].js - Tracking pixel endpoint
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../mongodb';
import { User, EmailEvent } from '../../../models/EmailEvent';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }
  
  console.log('Pixel tracking request received:', {  
    query: req.query,
    headers: req.headers,
    method: req.method
  });

  const emailId = req.query.emailID;
  const { p: recipient, c: company } = req.query;

  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await connectToDatabase();
    console.log('MongoDB connection successful');
    
    // Find the user by the emailId from the URL
    const user = await User.findOne({ email: emailId });
    if (!user) {
      console.error('User not found for email:', emailId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("Found user:", user);

    // Create a new email open event
    const openEvent = new EmailEvent({
      user: user._id,
      type: 'open',
      emailId,
      recipient,
      company,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    console.log('Saving event:', openEvent);
    // Save the event
    await openEvent.save();
    console.log(`Email open tracked: ${emailId} by ${recipient} at ${company}`);
    
    // Return a 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(pixel);
  } catch (error) {
    console.error('Error tracking open:', {
      error: error.message,
      stack: error.stack,
      emailId,
      recipient,
      company
    });
    return res.status(500).end();
  }
}
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../mongodb';
import { User, EmailEvent } from '../../../models/EmailEvent';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }
  
  console.log('Link tracking request received:', {
    query: req.query,
    headers: req.headers,
    method: req.method
  });

  
  const emailId = req.query.emailID;
  const { p: recipient, c: company, url} = req.query;
  console.log('Parsed query parameters:', {
    emailId,
    recipient,
    company,
    url
  });


  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await connectToDatabase();
    console.log('MongoDB connection successful');

      // have to get user id for the user whoes campaign this is
    const user = await User.findOne({ email: emailId });
    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }
    // Create a new click event
    const clickEvent = new EmailEvent({
      user: user._id,
      type: 'click',
      emailId,
      recipient,
      company,
      linkClicked: url,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    console.log('Saving event:', clickEvent);
    // Save the event
    await clickEvent.save();
    console.log(`Link click tracked: ${url} by ${recipient} at ${company}`);
    
    // Redirect to the actual URL
    res.redirect(url);
  } catch (error) {
    console.error('Error tracking click:', {
      error: error.message,
      stack: error.stack,
      emailId,
      url,
      recipient,
      company
    });
    // Even if tracking fails, redirect to the URL
    res.redirect(url);
  }
}
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../mongodb';
import { User, EmailEvent, Campaign } from '../../../models/EmailEvent';


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

  const userstring = req.query.emailID;
  const { p: recipient, c: company, url, camp: campaignstring } = req.query;

  // request is send with campaign id and user id and not email id
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await connectToDatabase();
    console.log('MongoDB connection successful');
    
    let userid;
    try {
      userid = await User.findById(userstring).select('_id');
    } catch (error) {
      console.log('error caught while finding user', error);
    }
    
    const campaignid = await Campaign.findById(campaignstring).select('_id');
    
    
    // Create a new click event

    const clickEvent = new EmailEvent({
      user: userid,
      type: 'click',
      campaign: campaignid,
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
      url,
      recipient,
      company
    });
    // Even if tracking fails, redirect to the URL
    res.redirect(url);
  }
}
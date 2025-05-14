// File: api/pixel/[emailID].js - Tracking pixel endpoint
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../mongodb';
import { User, EmailEvent, Campaign } from '../../../models/EmailEvent';

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



  const userstring = req.query.emailID;
  const { p: recipient, c: company, camp: campaignstring } = req.query;

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

    // Create a new email open event
    const openEvent = new EmailEvent({
      user: userid,
      type: 'open',
      campaign: campaignid,
      recipient,
      company,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    console.log('Saving event:', openEvent);
    // Save the event
    await openEvent.save();
    console.log(`Email open tracked for campaign: ${campaignstring} by ${recipient} at ${company}`);
    
    // Return a 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(pixel);
  } catch (error) {
    console.error('Error tracking open:', {
      error: error.message,
      stack: error.stack,
      campaign: campaignstring,
      recipient,
      company
    });
    res.status(500).end();
  }
}
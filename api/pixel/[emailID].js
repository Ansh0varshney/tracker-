// File: api/pixel/[emailId].js - Tracking pixel endpoint
import mongoose from 'mongoose';
import { connectToDatabase } from '../../mongodb';
import EmailEvent from '../../models/EmailEvent';

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

  const { emailId } = req.query;
  const recipient = req.query.p || 'unknown';
  const company = req.query.c || 'unknown';
  
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB
    await connectToDatabase();
    console.log('MongoDB connection successful');
    
    // Create a new email open event
    const openEvent = new EmailEvent({
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
import mongoose from 'mongoose';
import { connectToDatabase } from '../../mongodb';
import EmailEvent from '../../models/EmailEvent';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { emailId } = req.query;
  const { to, r: recipient, c: company } = req.query;
  
  if (!to) {
    return res.status(400).send('Missing destination URL');
  }
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Decode the destination URL
    const decodedUrl = decodeURIComponent(to);
    
    // Create a new link click event
    const clickEvent = new EmailEvent({
      type: 'click',
      emailId,
      recipient: recipient || 'unknown',
      company: company || 'unknown',
      linkClicked: decodedUrl,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    // Save the event
    await clickEvent.save();
    console.log(`Link click tracked: ${decodedUrl} by ${recipient} at ${company}`);
    
    // Redirect to the destination URL
    return res.redirect(decodedUrl);
  } catch (error) {
    console.error('Error tracking click:', error);
    // Redirect anyway, even if tracking fails
    return res.redirect(decodeURIComponent(to));
  }
}
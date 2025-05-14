import { connectToDatabase } from '../../mongodb';
import { EmailEvent } from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Get all events for the campaign
    const events = await EmailEvent.find({ campaign: campaignId });
    
    // Process events to calculate engagement metrics
    const recipientMap = new Map();
    
    events.forEach(event => {
      if (!recipientMap.has(event.recipient)) {
        recipientMap.set(event.recipient, {
          clicks: 0,
          views: 0,
          name: event.recipient.split('@')[0], // Default name from email
          email: event.recipient,
          company: event.company
        });
      }
      
      const recipient = recipientMap.get(event.recipient);
      if (event.type === 'click') recipient.clicks++;
      if (event.type === 'open') recipient.views++;
    });

    // Convert to array and calculate engagement scores
    const engagements = Array.from(recipientMap.entries()).map(([recipient, data]) => ({
      recipient,
      name: data.name,
      email: data.email,
      company: data.company,
      clicks: data.clicks,
      views: data.views,
      engagementScore: (0.6 * data.clicks) + (0.3 * data.views) // Simplified score without reply factor
    }));
    
    // Sort by engagement score in descending order
    engagements.sort((a, b) => b.engagementScore - a.engagementScore);

    return res.status(200).json(engagements);

  } catch (error) {
    console.error('Recipient engagement operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
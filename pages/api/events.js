import { connectToDatabase } from '../../mongodb';
import { EmailEvent } from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    await connectToDatabase();

    // Get all events for the campaign, sorted by timestamp
    // Fix: Use correct field for campaign filtering
    const events = await EmailEvent.find({ campaign: campaignId })
      .sort({ timestamp: -1 })
      .limit(1000); // Limit to last 1000 events for performance

    return res.status(200).json(events);

  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to get device info
function getDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'Mac';
  return 'Unknown';
}

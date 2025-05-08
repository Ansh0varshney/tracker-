import { connectToDatabase } from '../../mongodb';
import { EmailEvent } from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Get events with populated user data and sort by timestamp
    const events = await EmailEvent.find()
      .sort({ timestamp: -1 })
      .limit(100); // Limit to last 100 events for performance

    // Format the events data
    const formattedEvents = events.map(event => ({
      _id: event._id,
      type: event.type,
      emailId: event.emailId,
      recipient: event.recipient,
      company: event.company,
      linkClicked: event.linkClicked,
      userAgent: event.userAgent,
      timestamp: event.timestamp,
      device: getDeviceInfo(event.userAgent)
    }));

    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
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

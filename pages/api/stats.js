import { connectToDatabase } from '../../mongodb';
import { EmailEvent, Campaign} from '../../models/EmailEvent';

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

    // Get all events for the campaign
    const camid = await Campaign.findById(campaignId);
    const events = await EmailEvent.find({ campaign: camid._id });

    // Calculate statistics
    const openCount = events.filter(event => event.type === 'open').length;
    const clickCount = events.filter(event => event.type === 'click').length;
    
    // Get unique openers (based on recipient email)
    const uniqueOpeners = new Set(
      events
        .filter(event => event.type === 'open')
        .map(event => event.recipient)
    );
    const uniqueOpenersCount = uniqueOpeners.size;

    // Get unique clickers (based on recipient email)
    const uniqueClickers = new Set(
      events
        .filter(event => event.type === 'click')
        .map(event => event.recipient)
    );
    const uniqueClickersCount = uniqueClickers.size;

    // Get top companies (based on recipient email domain)
    const companyCounts = {};
    events.forEach(event => {
      if (event.type === 'open') {
        const domain = event.recipient.split('@')[1];
        companyCounts[domain] = (companyCounts[domain] || 0) + 1;
      }
    });

    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // dummy purpose 
    const sentCount = 100;

    return res.status(200).json({
      sentCount,
      openCount,
      clickCount,
      uniqueOpenersCount,
      uniqueClickersCount,
      topCompanies,

    });


  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
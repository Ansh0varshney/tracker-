import { connectToDatabase } from '../../mongodb';
import EmailEvent from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    await connectToDatabase();
    
    // Get counts of different event types
    const openCount = await EmailEvent.countDocuments({ type: 'open' });
    const clickCount = await EmailEvent.countDocuments({ type: 'click' });
    
    // Get unique recipients who have opened
    const uniqueOpeners = await EmailEvent.distinct('recipient', { type: 'open' });
    
    // Get unique companies
    const companies = await EmailEvent.distinct('company');
    
    // Get company engagement stats
    const companyStats = await Promise.all(
      companies.map(async (company) => {
        const opens = await EmailEvent.countDocuments({ company, type: 'open' });
        const clicks = await EmailEvent.countDocuments({ company, type: 'click' });
        return { company, opens, clicks, engagement: opens + clicks };
      })
    );
    
    // Most engaged companies
    companyStats.sort((a, b) => b.engagement - a.engagement);
    
    return res.status(200).json({
      totalEvents: openCount + clickCount,
      openCount,
      clickCount,
      uniqueOpenersCount: uniqueOpeners.length,
      topCompanies: companyStats.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: error.message });
  }
}
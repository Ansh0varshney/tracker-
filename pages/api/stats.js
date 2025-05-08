import { connectToDatabase } from '../../mongodb';
import { EmailEvent } from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Get counts using aggregation for better performance
    const [stats] = await EmailEvent.aggregate([
      {
        $group: {
          _id: null,
          openCount: {
            $sum: { $cond: [{ $eq: ['$type', 'open'] }, 1, 0] }
          },
          clickCount: {
            $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] }
          },
          uniqueOpeners: {
            $addToSet: {
              $cond: [{ $eq: ['$type', 'open'] }, '$recipient', null]
            }
          }
        }
      }
    ]);

    // Get company stats
    const companyStats = await EmailEvent.aggregate([
      {
        $group: {
          _id: '$company',
          opens: {
            $sum: { $cond: [{ $eq: ['$type', 'open'] }, 1, 0] }
          },
          clicks: {
            $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          company: '$_id',
          opens: 1,
          clicks: 1,
          engagement: { $add: ['$opens', '$clicks'] },
          _id: 0
        }
      },
      { $sort: { engagement: -1 } },
      { $limit: 5 }
    ]);

    return res.status(200).json({
      openCount: stats?.openCount || 0,
      clickCount: stats?.clickCount || 0,
      uniqueOpenersCount: stats?.uniqueOpeners?.filter(Boolean).length || 0,
      topCompanies: companyStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
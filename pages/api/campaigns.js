import { connectToDatabase } from '../../mongodb';
import { User, Campaign, EmailEvent } from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 

  try {
    await connectToDatabase();
    console.log('Connected to database'); 
    console.log('Request method:', req.query);
    // GET - List campaigns
    if (req.method === 'GET') {
      const { userId } = req.query;
      console.log('User ID:', userId);
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const campaigns = await Campaign.find({ user: userId })
        .sort({ createdAt: -1 });
      
      return res.status(200).json(campaigns);
    }

    // POST - Create new campaign
    if (req.method === 'POST') {
    
    
      const { userId, name, description } = req.body;

      // Find the class corresponding to the user from the User database
      const userDoc = await User.findById(userId);
      const userClass = userDoc ? userDoc.class : undefined;
      if(userClass === 'free')
      {
        const campaigns = await Campaign.find({ user: userId });
        if (campaigns.length >= 1) {
          return res.status(403).json({ error: 'Free users can only create one campaign' });
        }
      }

      if (!userId || !name) {
        return res.status(400).json({ error: 'User ID and campaign name are required' });
      }

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const campaign = new Campaign({
        user: userId,
        name,
        description: description || ''
      });

      await campaign.save();
      return res.status(201).json(campaign);
    }

    // PUT - Update campaign
    if (req.method === 'PUT') {
      const { campaignId, name, description } = req.body;
      
      if (!campaignId || !name) {
        return res.status(400).json({ error: 'Campaign ID and name are required' });
      }

      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { name, description: description || '' },
        { new: true }
      );

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      return res.status(200).json(campaign);
    }

    // DELETE - Delete campaign
    if (req.method === 'DELETE') {
      const { campaignId } = req.query;
      
      if (!campaignId) {
        return res.status(400).json({ error: 'Campaign ID is required' });
      }

      // Delete all events associated with this campaign
      await EmailEvent.deleteMany({ campaign: campaignId });

      const campaign = await Campaign.findByIdAndDelete(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      return res.status(200).json({ message: 'Campaign and related events deleted successfully' });
    }

  } catch (error) {
    console.error('Campaign operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
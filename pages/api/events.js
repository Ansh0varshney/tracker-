import { connectToDatabase } from '../../mongodb';
import EmailEvent from '../../models/EmailEvent';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    await connectToDatabase();
    const events = await EmailEvent.find().sort({ timestamp: -1 });
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: error.message });
  }
}

import { mongooseConnect } from '@/lib/mongoose';
import Hero from '@/models/Hero';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await mongooseConnect();

    const heroes = await Hero.find({}).sort({ order: 1, createdAt: -1 }).lean();

    // return the raw DB documents (frontend will normalize). Using .lean() for perf.
    return res.status(200).json(heroes || []);
  } catch (err) {
    console.error('Hero API GET error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
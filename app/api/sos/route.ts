// /pages/api/sos.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';  // assuming you have prisma setup

// Handle the POST request to send SOS
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { location, userId } = req.body;

    if (!location || !userId) {
      return res.status(400).json({ error: 'Location and userId are required' });
    }

    try {
      // Create a new SOSAlert in the database
      const SOSAlert = await prisma.sOSAlert.create({
        data: {
          location,
          userId,
        },
      });

      // You can add logic here to notify the admin, e.g., via email or a real-time service

      return res.status(200).json({ success: true, SOSAlert });
    } catch (error) {
      console.error('Error saving SOS alert:', error);
      return res.status(500).json({ error: 'Error processing SOS alert' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

import { db, analytics } from '../db';
import { sql } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const stats = await db.select().from(analytics);
      const result = stats.reduce((acc: any, curr: any) => {
        acc[curr.pageName] = curr.views;
        return acc;
      }, {});
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { pageName } = req.body;
      if (!pageName) return res.status(400).json({ error: 'Page name is required' });

      await db.insert(analytics).values({
        pageName,
        views: 1,
      }).onConflictDoUpdate({
        target: analytics.pageName,
        set: { views: sql`${analytics.views} + 1` },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update analytics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

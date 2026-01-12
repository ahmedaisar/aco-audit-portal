import { db, changeRequests, files as filesTable } from '../db/index.js';
import { desc, eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const requests = await db.query.changeRequests.findMany({
        with: {
          files: true,
        },
        orderBy: [desc(changeRequests.timestamp)],
      });
      return res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { request, files } = req.body;
      
      await db.insert(changeRequests).values({
        id: request.id,
        tabType: request.tabType,
        requestorName: request.requestorName,
        department: request.department,
        emailId: request.emailId,
        todayDate: request.todayDate,
        priority: request.priority,
        url: request.url,
        pageName: request.pageName,
        changeDescription: request.changeDescription,
        desiredGoLiveDate: request.desiredGoLiveDate,
        resortName: request.resortName,
        resortOpsContact: request.resortOpsContact,
        checklistData: request.checklistData,
        notesData: request.notesData,
      });

      if (files && files.length > 0) {
        await db.insert(filesTable).values(
          files.map((f: any) => ({
            requestId: request.id,
            name: f.name,
            size: f.size,
            type: f.type,
            url: f.url,
          }))
        );
      }

      return res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save request' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Clear all requests (as per storageService.clearRequests)
      await db.delete(changeRequests);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to clear requests' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

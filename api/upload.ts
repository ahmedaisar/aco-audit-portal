import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: any, res: any) {
  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        /**
         * Generate a token for the client to upload a file.
         * You can add authorization logic here.
         */
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // user_id: '1234',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called once the file has been successfully uploaded,
        // and its metadata has been registered in the Blob storage.
        // You can use this to update your database.
        console.log('blob upload completed', blob, tokenPayload);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

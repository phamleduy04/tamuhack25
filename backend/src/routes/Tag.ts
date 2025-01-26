import { Router } from 'express';
import db from '../db';
import s3 from '../s3'; // Assuming the S3 client is exported from index.ts

const index = Router();

index.post('/', async (req, res) => {
    const { fileName, tag } = req.body;

    if (!fileName || !tag) {
        res.status(400).json({ error: 'fileName and tag are required' });
        return;
    }
    
    const fileNameParsed = decodeURIComponent(fileName);

    try {
        // Check if the file exists in the S3 bucket
        const params = {
            Bucket: process.env.B2_BUCKET_NAME!, // Ensure this environment variable is set
            Key: fileNameParsed,
        };

        await s3.headObject(params).promise();

        // If the file exists, add the tag and file name to the database
        const newTag = await db.fileTag.upsert({
            where: {
                filename: fileNameParsed,
            },
            update: {
                tag
            },
            create: {
                filename: fileNameParsed,
                tag,
            }
        });

        res.status(201).json(newTag);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

export default index;
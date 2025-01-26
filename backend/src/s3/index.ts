import 'dotenv/config';
import { S3 } from 'aws-sdk';

const s3 = new S3({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!
    }
});

export default s3;
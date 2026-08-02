import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ssri-uploads';
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://docs.ssri.org.pk';

const hasCredentials = ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY;

const r2 = hasCredentials ? new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
  forcePathStyle: true
}) : null;

export async function mirrorAsset(url, localName, r2Key, mimeType) {
  const publicImages = path.resolve('public/images');
  if (!fs.existsSync(publicImages)) fs.mkdirSync(publicImages, { recursive: true });

  const localPath = path.join(publicImages, localName);
  console.log(`Downloading: ${url} -> ${localPath}`);
  
  try {
    execSync(`curl.exe -k -s -L -A "Mozilla/5.0" "${url}" -o "${localPath}"`);
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
    return null;
  }

  if (fs.existsSync(localPath) && r2) {
    const buffer = fs.readFileSync(localPath);
    try {
      await r2.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: r2Key,
        Body: buffer,
        ContentType: mimeType
      }));
      console.log(`✓ R2 Uploaded: ${PUBLIC_DOMAIN}/${r2Key}`);
      return `${PUBLIC_DOMAIN}/${r2Key}`;
    } catch (err) {
      console.error(`Failed to upload ${r2Key} to R2:`, err.message);
    }
  }

  return `/images/${localName}`;
}

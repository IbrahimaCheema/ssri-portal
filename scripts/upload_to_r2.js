import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '';
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ssri-uploads';

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('❌ Cloudflare R2 credentials missing in .env');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const existingR2Objects = new Map();

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.ico') return 'image/x-icon';
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.woff') return 'font/woff';
  if (ext === '.woff2') return 'font/woff2';
  if (ext === '.ttf') return 'font/ttf';
  return 'application/octet-stream';
}

async function fetchR2State() {
  console.log('--- Fetching Cloudflare R2 Bucket Inventory ---');
  let token;
  do {
    const listResp = await s3Client.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      ContinuationToken: token,
    }));
    if (listResp.Contents) {
      for (const item of listResp.Contents) {
        if (item.Key) existingR2Objects.set(item.Key, item.Size);
      }
    }
    token = listResp.NextContinuationToken;
  } while (token);
  console.log(`✓ Inventory loaded: ${existingR2Objects.size} objects in R2 bucket.`);
}

async function uploadFolder(localDir, s3Prefix = '') {
  const files = fs.readdirSync(localDir);
  for (const file of files) {
    const fullPath = path.join(localDir, file);
    const relativePath = s3Prefix ? `${s3Prefix}/${file}` : file;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await uploadFolder(fullPath, relativePath);
    } else {
      const remoteSize = existingR2Objects.get(relativePath);
      if (remoteSize !== undefined && remoteSize === stat.size) {
        console.log(`Skipping unchanged -> ${relativePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(fullPath);
      const mimeType = getMimeType(fullPath);

      console.log(`Uploading media -> ${relativePath} (${mimeType})...`);
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: relativePath,
        Body: fileBuffer,
        ContentType: mimeType,
      }));
      console.log(`✓ Uploaded ${relativePath}`);
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
}

async function main() {
  console.log(`Syncing media to Cloudflare R2 bucket: ${BUCKET_NAME}...`);
  await fetchR2State();

  const imagesDir = path.resolve('public/images');
  if (fs.existsSync(imagesDir)) {
    await uploadFolder(imagesDir, 'images');
  }

  console.log('\n🎉 CLOUDFLARE R2 BUCKET MEDIA SYNC COMPLETE!');
}

main().catch(err => {
  console.error('❌ R2 Media Sync Failed:', err);
  process.exit(1);
});

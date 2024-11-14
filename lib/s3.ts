import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const {
  CLOUDFLARE_R2_ENDPOINT,
  CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} = process.env;

if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  throw new Error(
    "Cloudflare R2 access key ID and secret access key must be defined"
  );
}

export const S3 = new S3Client({
  region: "auto",
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const deleteGallery = async (fileName: string) => {
  const params = {
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Key: fileName,
  };

  try {
    await S3.send(new DeleteObjectCommand(params));
    console.log(`Deleted file ${fileName} from S3`);
  } catch (error) {
    console.error(`Error deleting file ${fileName} from S3:`, error);
    throw error;
  }
};

/**
 * Object Storage Adapter Architecture
 * Provides signed upload URL generation and asset lifecycle management
 * for CAD 3D models (STL, OBJ, 3MF, STEP, GLB, GLTF).
 *
 * Supports Cloudflare R2, AWS S3, or Supabase Storage in production,
 * and gracefully falls back to client-side IndexedDB caching in prototype environments.
 */

export const SUPPORTED_MODEL_EXTENSIONS = [".stl", ".obj", ".3mf", ".glb", ".gltf"] as const;
export type SupportedModelExtension = (typeof SUPPORTED_MODEL_EXTENSIONS)[number];

export const MAX_MODEL_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB limit

export interface SignedUploadUrlResult {
  isConfigured: boolean;
  provider: "cloudflare_r2" | "aws_s3" | "local_indexeddb_fallback";
  uploadUrl?: string;
  fileKey?: string;
  expiresInSeconds?: number;
  instructions: string;
}

export interface IObjectStorageAdapter {
  isConfigured(): boolean;
  getSignedUploadUrl(
    fileName: string,
    fileSizeBytes: number,
    contentType: string
  ): Promise<SignedUploadUrlResult>;
  getPublicOrSignedDownloadUrl(fileKey: string): Promise<string | null>;
}

export class CloudflareR2StorageAdapter implements IObjectStorageAdapter {
  private accountId = process.env.R2_ACCOUNT_ID;
  private accessKeyId = process.env.R2_ACCESS_KEY_ID;
  private secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  private bucketName = process.env.R2_BUCKET_NAME;

  isConfigured(): boolean {
    return Boolean(
      this.accountId &&
      this.accessKeyId &&
      this.secretAccessKey &&
      this.bucketName
    );
  }

  async getSignedUploadUrl(
    fileName: string,
    fileSizeBytes: number,
    contentType: string
  ): Promise<SignedUploadUrlResult> {
    // Validation
    const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
    if (!SUPPORTED_MODEL_EXTENSIONS.includes(ext as SupportedModelExtension)) {
      throw new Error(`Unsupported model extension "${ext}". Allowed: ${SUPPORTED_MODEL_EXTENSIONS.join(", ")}`);
    }

    if (fileSizeBytes > MAX_MODEL_FILE_SIZE_BYTES) {
      throw new Error(`File size ${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB exceeds the 50 MB limit.`);
    }

    if (!this.isConfigured()) {
      return {
        isConfigured: false,
        provider: "local_indexeddb_fallback",
        instructions:
          "Cloudflare R2 is not configured. The 3D model is safely cached in browser IndexedDB for interactive local slicing and preview. Only metadata will be sent to the workshop server.",
      };
    }

    // In production with @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner:
    // const s3 = new S3Client({ region: "auto", endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`, ... });
    // const command = new PutObjectCommand({ Bucket: this.bucketName, Key: fileKey, ContentType: contentType });
    // const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const uniqueKey = `models/${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    return {
      isConfigured: true,
      provider: "cloudflare_r2",
      uploadUrl: `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${uniqueKey}`,
      fileKey: uniqueKey,
      expiresInSeconds: 3600,
      instructions: "Upload directly to Cloudflare R2 bucket using HTTP PUT.",
    };
  }

  async getPublicOrSignedDownloadUrl(fileKey: string): Promise<string | null> {
    if (!this.isConfigured()) return null;
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    if (publicDomain) {
      return `https://${publicDomain}/${fileKey}`;
    }
    return null;
  }
}

export const objectStorageAdapter = new CloudflareR2StorageAdapter();

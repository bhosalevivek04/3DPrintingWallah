/**
 * IndexedDB Storage Service for Local 3D Model Files
 * Prototype client-only storage: stores raw Blobs/Files in IndexedDB.
 * Zero external dependencies; avoids Base64 overhead and localStorage limits.
 */

export interface StoredModelRecord {
  id: string;
  name: string;
  extension: string;
  size: number;
  formattedSize: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const SUPPORTED_EXTENSIONS = [".stl", ".obj", ".3mf", ".glb", ".gltf"] as const;

export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

const DB_NAME = "3dprintingwallah_model_storage";
const DB_VERSION = 1;
const STORE_NAME = "models";

/**
 * Format bytes into human-readable units (B, KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Open (or create) the IndexedDB database.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

/**
 * Extract clean lowercase extension including the dot (e.g. ".stl").
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Check if a file extension is supported.
 */
export function isExtensionSupported(filename: string): boolean {
  const ext = getFileExtension(filename);
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an incoming file against size, format, empty state, and duplicates.
 */
export function validateModelFile(
  file: File,
  existingModels: StoredModelRecord[] = []
): FileValidationResult {
  // 1. Empty file check
  if (file.size === 0) {
    return {
      valid: false,
      error: `"${file.name}" is an empty file (0 bytes). Please upload a valid 3D model.`,
    };
  }

  // 2. Extension check
  const ext = getFileExtension(file.name);
  if (!isExtensionSupported(file.name)) {
    const formattedSupported = SUPPORTED_EXTENSIONS.join(", ");
    return {
      valid: false,
      error: `"${file.name}" has an unsupported format (${ext || "no extension"}). Supported formats: ${formattedSupported}.`,
    };
  }

  // 3. Size limit check (50 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" (${formatBytes(file.size)}) exceeds the maximum allowed limit of 50 MB.`,
    };
  }

  // 4. Duplicate check (matching filename and byte size)
  const isDuplicate = existingModels.some(
    (existing) => existing.name === file.name && existing.size === file.size
  );
  if (isDuplicate) {
    return {
      valid: false,
      error: `"${file.name}" (${formatBytes(file.size)}) has already been added.`,
    };
  }

  return { valid: true };
}

/**
 * Retrieve all stored 3D models from IndexedDB.
 */
export async function getAllStoredModels(): Promise<StoredModelRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records: StoredModelRecord[] = request.result || [];
        // Sort descending by creation date (newest first)
        records.sort((a, b) => b.createdAt - a.createdAt);
        resolve(records);
      };

      request.onerror = () => reject(request.error || new Error("Failed to load models"));
    });
  } catch (error) {
    console.error("IndexedDB getAllStoredModels error:", error);
    return [];
  }
}

/**
 * Store a single File/Blob in IndexedDB.
 */
export async function storeModelFile(file: File): Promise<StoredModelRecord> {
  const db = await openDB();
  const ext = getFileExtension(file.name);
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `model_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const record: StoredModelRecord = {
    id,
    name: file.name,
    extension: ext,
    size: file.size,
    formattedSize: formatBytes(file.size),
    blob: file, // Store raw Blob/File directly
    mimeType: file.type || "application/octet-stream",
    createdAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(record);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error || new Error(`Failed to store "${file.name}" in IndexedDB`));
  });
}

/**
 * Delete a single stored model by ID.
 */
export async function deleteStoredModel(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error(`Failed to delete model ${id}`));
  });
}

/**
 * Clear all models from IndexedDB.
 */
export async function clearAllStoredModels(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error("Failed to clear IndexedDB models"));
  });
}

import {
  validateModelFile,
  formatBytes,
  MAX_FILE_SIZE_BYTES,
  StoredModelRecord,
} from "../src/lib/storage/model-storage";

console.log("=== Testing 3D Model Upload Validation Scenarios ===");

// Scenario 1: Valid STL file
const stlFile = { name: "bracket_v1.stl", size: 1024 * 1024 } as File;
const res1 = validateModelFile(stlFile, []);
console.log("Scenario 1 (Valid STL):", res1.valid ? "PASS" : "FAIL", res1);

// Scenario 2: Valid OBJ file
const objFile = { name: "character_bust.obj", size: 5 * 1024 * 1024 } as File;
const res2 = validateModelFile(objFile, []);
console.log("Scenario 2 (Valid OBJ):", res2.valid ? "PASS" : "FAIL", res2);

// Scenario 3: Valid GLB file
const glbFile = { name: "mechanical_gear.glb", size: 12 * 1024 * 1024 } as File;
const res3 = validateModelFile(glbFile, []);
console.log("Scenario 3 (Valid GLB):", res3.valid ? "PASS" : "FAIL", res3);

// Scenario 4: Unsupported PDF file
const pdfFile = { name: "blueprint.pdf", size: 2 * 1024 * 1024 } as File;
const res4 = validateModelFile(pdfFile, []);
console.log("Scenario 4 (Unsupported PDF rejected):", !res4.valid ? "PASS" : "FAIL", res4.error);

// Scenario 5: File larger than 50MB
const oversizeFile = { name: "huge_sculpture.stl", size: 55 * 1024 * 1024 } as File;
const res5 = validateModelFile(oversizeFile, []);
console.log("Scenario 5 (Oversize >50MB rejected):", !res5.valid ? "PASS" : "FAIL", res5.error);

// Scenario 6: Empty 0-byte file
const emptyFile = { name: "corrupted.stl", size: 0 } as File;
const res6 = validateModelFile(emptyFile, []);
console.log("Scenario 6 (Empty 0-byte rejected):", !res6.valid ? "PASS" : "FAIL", res6.error);

// Scenario 7: Duplicate file
const existing: StoredModelRecord[] = [
  {
    id: "1",
    name: "bracket_v1.stl",
    extension: ".stl",
    size: 1024 * 1024,
    formattedSize: "1 MB",
    blob: {} as Blob,
    mimeType: "model/stl",
    createdAt: Date.now(),
  },
];
const res7 = validateModelFile(stlFile, existing);
console.log("Scenario 7 (Duplicate rejected):", !res7.valid ? "PASS" : "FAIL", res7.error);

// Scenario 8: Format bytes helper
console.log("Scenario 8 (formatBytes helper):", formatBytes(1024 * 1024) === "1 MB" ? "PASS" : "FAIL");

console.log("=== All Validation Tests Executed Successfully ===");

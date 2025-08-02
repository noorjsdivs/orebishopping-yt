import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp directory exists
const ensureTempDir = () => {
  const tempDir = path.join(__dirname, "../public/temp/");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log("Created temp directory:", tempDir);
  }
  return tempDir;
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Ensure temp directory exists before using it
    try {
      const tempDir = ensureTempDir();
      callback(null, tempDir);
    } catch (error) {
      console.error("Error creating temp directory:", error);
      callback(error, null);
    }
  },
  filename: function (req, file, callback) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, extension);
    callback(null, uniqueSuffix + "-" + nameWithoutExt + extension);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, callback) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;

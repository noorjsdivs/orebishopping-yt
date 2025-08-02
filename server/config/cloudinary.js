import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

// Helper function to extract public_id from Cloudinary URL
const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;

  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split("/");
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));

    if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
      // Remove file extension from the last part
      const filename = urlParts[urlParts.length - 1];
      const filenameWithoutExt = filename.split(".")[0];

      // Reconstruct the public_id with folder structure
      const folderParts = urlParts.slice(versionIndex + 1, -1);
      return folderParts.length > 0
        ? `${folderParts.join("/")}/${filenameWithoutExt}`
        : filenameWithoutExt;
    }

    // Fallback: assume last part is filename
    const filename = urlParts[urlParts.length - 1];
    return filename.split(".")[0];
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

// Helper function to delete image from Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl) return { success: false, message: "No image URL provided" };

    const publicId = getCloudinaryPublicId(imageUrl);
    if (!publicId) {
      return {
        success: false,
        message: "Could not extract public_id from URL",
      };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      message:
        result.result === "ok"
          ? "Image deleted successfully"
          : "Image deletion failed",
      result,
    };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return { success: false, message: error.message };
  }
};

export default connectCloudinary;
export { cloudinary, getCloudinaryPublicId, deleteCloudinaryImage };

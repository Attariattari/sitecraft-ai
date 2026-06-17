import { v2 as cloudinary } from "cloudinary";

// Cloudinary will automatically use CLOUDINARY_URL if it's set in process.env
// But we'll provide fallback config just in case
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export default cloudinary;

/**
 * Upload a file to Cloudinary
 * @param {string} fileBuffer - The file content as a base64 string or buffer
 * @param {string} folder - The folder to upload to (e.g. 'users/profile-images')
 * @returns {Promise} - The Cloudinary upload result
 */
export const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileBuffer,
      {
        folder: `SiteCraft-AI/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise} - The Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

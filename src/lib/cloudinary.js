import { v2 as cloudinary } from "cloudinary";
import { serverEnv } from "@/lib/server/env";

// Cloudinary config
if (!serverEnv.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
    api_key: serverEnv.CLOUDINARY_API_KEY,
    api_secret: serverEnv.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const allowedFolders = new Set([
  "users/profile-images",
  "blogs",
  "templates",
  "themes",
  "generated-sites",
]);

const allowedDataImageTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export function validateCloudinaryFolder(folder) {
  if (!allowedFolders.has(folder)) {
    throw new Error("Upload folder is not allowed.");
  }
}

export function validateImageDataUri(fileBuffer, maxBytes = 5 * 1024 * 1024, options = {}) {
  const value = String(fileBuffer || "");
  const match = value.match(/^data:([^;]+);base64,/i);
  const mime = match?.[1]?.toLowerCase();
  const allowSvg = Boolean(options.allowTrustedSvg);
  if (mime && !allowedDataImageTypes.has(mime) && !(allowSvg && mime === "image/svg+xml")) {
    throw new Error("Unsupported image type.");
  }
  const payload = value.includes(",") ? value.split(",").pop() : value;
  const sizeInBytes = (payload.length * 3) / 4;
  if (sizeInBytes > maxBytes) {
    throw new Error("Image size exceeds the allowed limit.");
  }
}

/**
 * Upload a file (base64 or buffer) to Cloudinary
 */
export const uploadToCloudinary = async (fileBuffer, folder, options = {}) => {
  validateCloudinaryFolder(folder);
  validateImageDataUri(
    fileBuffer,
    folder === "blogs" ? 8 * 1024 * 1024 : 5 * 1024 * 1024,
    options,
  );
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
 * Upload a remote image (URL) to Cloudinary
 */
export const uploadRemoteImageToCloudinary = async (imageUrl, folder) => {
  validateCloudinaryFolder(folder);
  if (!/^https:\/\//i.test(String(imageUrl || ""))) {
    throw new Error("Remote image URL must use HTTPS.");
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        folder: `SiteCraft-AI/${folder}`,
        resource_type: "image",
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
 */
export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

export default cloudinary;

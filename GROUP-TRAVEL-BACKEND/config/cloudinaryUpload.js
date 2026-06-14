import cloudinary from './cloudinary.js';

/**
 * Uploads a file buffer directly to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer memory storage
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'group-travel-gallery' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

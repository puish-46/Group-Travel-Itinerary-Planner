import express from 'express';
import PhotoModel from '../models/PhotoModel.js';
import verifyToken from '../middlewares/verifyToken.js';
import upload from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

const router = express.Router();

// POST /upload - Upload photo to Cloudinary and save details in DB (Protected)
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { tripId } = req.body;

    // Validate fields
    if (!tripId) {
      return res.status(400).json({ message: 'Trip ID is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Upload image to Cloudinary using helper
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    // Save photo record in database
    const newPhoto = new PhotoModel({
      tripId,
      imageUrl,
      uploadedBy: req.user.id
    });

    const savedPhoto = await newPhoto.save();
    res.status(201).json({ message: 'Photo uploaded successfully.', photo: savedPhoto });
  } catch (error) {
    res.status(500).json({ message: 'Server error during photo upload.', error: error.message });
  }
});

// GET /trip/:tripId - Get all photos for a trip
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    const photos = await PhotoModel.find({ tripId }).populate('uploadedBy', 'name email');
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching photos.', error: error.message });
  }
});

// DELETE /delete/:photoId - Delete a photo (Protected, only uploader can delete)
router.delete('/delete/:photoId', verifyToken, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    const photo = await PhotoModel.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found.' });
    }

    // Verify if the logged-in user is the uploader of the photo
    if (photo.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. Only the uploader can delete this photo.' });
    }

    await PhotoModel.findByIdAndDelete(photoId);
    res.status(200).json({ message: 'Photo deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting photo.', error: error.message });
  }
});

export default router;

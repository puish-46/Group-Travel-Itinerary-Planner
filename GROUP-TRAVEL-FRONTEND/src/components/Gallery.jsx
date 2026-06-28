import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera, Trash2, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Gallery = ({ tripId }) => {
  const { tripId: paramTripId } = useParams();
  const activeTripId = tripId || paramTripId;

  const { currentUser, isAuthenticated } = useAuthStore();

  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-api/trip/${activeTripId}`);
      setPhotos(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load photos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTripId) {
      fetchPhotos();
    }
  }, [activeTripId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('tripId', activeTripId);

    setUploading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/gallery-api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchPhotos();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/gallery-api/delete/${photoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPhotos();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete photo.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Photo Gallery
          </h3>
          <p className="text-xs text-text-muted">Share and capture beautiful moments with your crew</p>
        </div>
      </div>

      {/* Upload image form */}
      {isAuthenticated && (
        <form onSubmit={handleUpload} className="bg-slate-50 border border-slate-200/85 p-5 sm:p-6 rounded-xl">
          <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3">Upload a Photo</h4>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                required
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full text-xs text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-primary/20 file:text-xs file:font-bold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:transition-all file:cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-md shadow-accent/15 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <ImageIcon className="w-10 h-10 text-slate-350 mx-auto mb-3" />
          <p className="text-text-muted text-sm font-medium">No photos uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const isUploader = isAuthenticated && currentUser && photo.uploadedBy?._id === currentUser._id;
            
            return (
              <div
                key={photo._id}
                className="bg-white border border-slate-200/80 rounded-xl overflow-hidden relative group hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={photo.imageUrl}
                    alt="Trip memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover overlay details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between text-white w-full">
                      <p className="text-[10px] font-bold truncate pr-2">
                        Uploaded by: <span className="text-orange-400">{photo.uploadedBy?.name || 'Unknown'}</span>
                      </p>
                      {isUploader && (
                        <button
                          onClick={() => handleDeletePhoto(photo._id)}
                          className="p-1.5 rounded-lg bg-red-600/95 hover:bg-red-700 text-white transition-all duration-350 cursor-pointer shadow-sm"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Gallery;

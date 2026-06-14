import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <h3 className="text-2xl font-black text-text-dark mb-6">Shared Photo Gallery</h3>

      {/* Upload image form */}
      {isAuthenticated && (
        <form onSubmit={handleUpload} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8">
          <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4">Upload a Photo</h4>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept="image/*"
              required
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full text-xs text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:transition-colors file:cursor-pointer"
            />
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                'Upload Photo'
              )}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center mb-6 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : photos.length === 0 ? (
        <p className="text-text-muted text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl font-medium">
          No photos uploaded yet. Be the first to share memories of the trip!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const isUploader = isAuthenticated && currentUser && photo.uploadedBy?._id === currentUser._id;
            
            return (
              <div
                key={photo._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden relative group hover:border-primary/20 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={photo.imageUrl}
                    alt="Trip memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-3 flex items-center justify-between gap-4 border-t border-slate-50">
                  <p className="text-[10px] text-text-muted font-bold truncate">
                    Uploaded by:{' '}
                    <span className="text-primary font-bold">{photo.uploadedBy?.name || 'Unknown'}</span>
                  </p>
                  
                  {isUploader && (
                    <button
                      onClick={() => handleDeletePhoto(photo._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
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

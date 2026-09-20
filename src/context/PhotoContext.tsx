import React, { createContext, useContext, useState, useEffect } from 'react';

interface PhotoContextType {
  photoUrl: string;
  updatePhoto: (dataUrl: string) => Promise<boolean>;
  resetPhoto: () => void;
  isCustomPhoto: boolean;
  uploading: boolean;
}

const PhotoContext = createContext<PhotoContextType>({
  photoUrl: '/priyadarshan.jpg',
  updatePhoto: async () => false,
  resetPhoto: () => {},
  isCustomPhoto: false,
  uploading: false,
});

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUrl, setPhotoUrl] = useState<string>('/priyadarshan.jpg');
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('priyadarshan_exact_photo');
      if (saved && saved.length > 50) {
        setPhotoUrl(saved);
        setIsCustomPhoto(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const updatePhoto = async (dataUrl: string): Promise<boolean> => {
    try {
      setUploading(true);
      setPhotoUrl(dataUrl);
      setIsCustomPhoto(true);
      try {
        localStorage.setItem('priyadarshan_exact_photo', dataUrl);
      } catch (lsErr) {
        console.warn('LocalStorage full or unavailable', lsErr);
      }

      // Persist to server disk so /priyadarshan.jpg is physically written
      try {
        await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl }),
        });
      } catch (srvErr) {
        console.warn('Server sync failed, retained in client memory:', srvErr);
      }

      return true;
    } catch (err) {
      console.error('Failed to update photo:', err);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const resetPhoto = () => {
    try {
      localStorage.removeItem('priyadarshan_exact_photo');
    } catch (e) {
      // ignore
    }
    setPhotoUrl('/priyadarshan.jpg');
    setIsCustomPhoto(false);
  };

  return (
    <PhotoContext.Provider value={{ photoUrl, updatePhoto, resetPhoto, isCustomPhoto, uploading }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhoto = () => useContext(PhotoContext);

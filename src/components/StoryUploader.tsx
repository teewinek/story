import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';

interface StoryUploaderProps {
  onUpload: (file: File) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export const StoryUploader: React.FC<StoryUploaderProps> = ({
  onUpload,
  maxSize = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image or video.');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          aria-label="Upload file"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-[9/16] rounded-lg overflow-hidden"
            >
              {preview.startsWith('data:image') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              )}
              <button
                onClick={() => {
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Remove file"
              >
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your story here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      browse files
                    </button>
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ImageIcon size={16} />
                    <span>Images</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={16} />
                    <span>Videos</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-red-500 bg-white px-4 py-2 rounded-full shadow-lg"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};
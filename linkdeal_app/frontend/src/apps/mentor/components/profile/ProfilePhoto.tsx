import { FunctionComponent, useRef, useState } from 'react';

export const ProfilePhoto: FunctionComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size <= 2 * 1024 * 1024) { // 2MB limit
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('File size must be less than 2MB');
      }
    } else {
      alert('Please select an image file (JPG, PNG, or GIF)');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Profile Photo</h2>

      <div className="flex items-center gap-6">
        <div
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`w-24 h-24 rounded-full overflow-hidden bg-[#7008E7] flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-purple-500/30 transition-all duration-200 ${isDragging ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent' : ''}`}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              'MD'
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#7008E7] shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-110 hover:bg-[#8B5CF6] transition-all duration-300 transform flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.3333 11.3333L12 8L8.66667 11.3333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 16V18.6667C18 19.0203 17.8595 19.3594 17.6095 19.6095C17.3594 19.8595 17.0203 20 16.6667 20H7.33333C6.97971 20 6.64057 19.8595 6.39052 19.6095C6.14048 19.3594 6 19.0203 6 18.6667V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <p className="text-white/80 text-sm">
              {selectedImage ? 'Image uploaded successfully!' : 'Upload a professional photo'}
            </p>
            <p className="text-white/50 text-xs">
              {isDragging ? 'Drop your image here' : 'JPG, PNG or GIF (max 2MB)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

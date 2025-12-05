import { FunctionComponent } from 'react';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const FileUpload: FunctionComponent<FileUploadProps> = ({ files, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onChange([...files, ...selectedFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    onChange([...files, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="flex flex-col gap-3 text-gray-300">
      <label className="text-sm font-semibold">Attachments (Optional)</label>
      <div
        className="relative rounded-3xl border-2 border-dashed border-white/15 bg-white/5 px-6 py-8 text-center text-white transition-all hover:border-[#7008E7] hover:bg-white/10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 32V16" stroke="#7008E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 22L24 16L30 22" stroke="#7008E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 32V40C8 41.1046 8.89543 42 10 42H38C39.1046 42 40 41.1046 40 40V32" stroke="#7008E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-base font-inter">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-400">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-4 text-red-300 hover:text-red-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { FileUpload };

"use client";

import React, { useCallback, useState } from "react";
import { FileImage, Upload, X } from "lucide-react";
import Image from "next/image";

// Single Image Dropzone
interface SingleDropzoneProps {
  onFileSelect: (file: File | null) => void;
  value?: File | null;
  className?: string;
}

export const SingleDropzone: React.FC<SingleDropzoneProps> = ({
  onFileSelect,
  value,
  className = "",
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string>("");

  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview("");
  };

  if (value && preview) {
    return (
      <div className="relative w-full h-72 rounded-lg overflow-hidden">
        <img
          src={preview}
          alt="Preview"
          className="rounded-md w-full h-full object-scale-down"
        />
        <button
          onClick={removeFile}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm truncate">
          {value.name}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label
        className={`
          flex flex-col items-center justify-center w-full h-64
          border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500"
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-4 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">Upload main image</p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
        />
      </label>
    </div>
  );
};

// Multiple Images Dropzone
interface MultiDropzoneProps {
  onFileSelect: (files: File[]) => void;
  value?: File[];
  className?: string;
}

export const MultiDropzone: React.FC<MultiDropzoneProps> = ({
  onFileSelect,
  value = [],
  className = "",
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (newFiles.length > 0) {
        onFileSelect([...value, ...newFiles]);
      }
    },
    [onFileSelect, value]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      onFileSelect([...value, ...newFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = value.filter((file) => file !== fileToRemove);
    onFileSelect(updatedFiles);
  };

  return (
    <div className={className}>
      <div
        className={`relative`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label
          className={`
            flex flex-col items-center justify-center w-full h-32
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">Upload multiple images</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            multiple
          />
        </label>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((file, index) => (
            <PreviewImage
              key={index}
              file={file}
              onRemove={() => removeFile(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Preview Image Component
interface PreviewImageProps {
  file: File;
  onRemove: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string>("");

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative group rounded-lg overflow-hidden">
      <div className="aspect-square">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="object-scale-down rounded-md"
            width={216}
            height={192 * 2}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FileImage className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
          {file.name}
        </div>
      </div>
    </div>
  );
};

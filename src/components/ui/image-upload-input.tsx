"use client";

import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";

interface ImageUploadProps {
  value?: string;
  folder?: string;
}

export interface ImageUploadRef {
  uploadToCloudinary: () => Promise<string>;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ value, folder = "foodhub/general" }, ref) => {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      uploadToCloudinary: async () => {
        console.log("UPLOAD API CALLED");
        if (!file) {
          if (value) return value;
          throw new Error("No image selected");
        }

        setIsUploading(true);

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const response = await fetch("/api/cloudinary-upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          const url = data.secure_url;

          return url;
        } finally {
          setIsUploading(false);
        }
      },
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      console.log(selectedFile);
      if (!selectedFile) return;

      if (selectedFile.size > 5000000) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (
        !["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)
      ) {
        toast.error("Only JPG, PNG, and WebP formats allowed");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    };

    const handleRemove = () => {
      setFile(null);
      setPreview(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative w-full max-w-sm">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full"
            />
            {!isUploading && (
              <Button
                type="button"
                onClick={handleRemove}
                variant="destructive"
                size="icon-sm"
                className="absolute top-2 right-2 cursor-pointer rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-white font-medium">Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-gray-400 transition max-w-sm"
          >
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600 mt-2">Click to select image</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or WebP (Max 5MB)
            </p>
          </label>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;

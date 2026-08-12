"use client";

import { useState, useRef, useCallback } from "react";
import { ImagePlus, X, Star, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleImage {
  id: string;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  position: number;
}

interface ImageUploaderProps {
  vehicleId: string;
  images: VehicleImage[];
  onImagesChange: (images: VehicleImage[]) => void;
}

export function ImageUploader({
  vehicleId,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      setUploading(true);

      const fileArray = Array.from(files).slice(0, 10 - images.length);
      if (fileArray.length === 0) {
        setError("Maximum 10 images per vehicle.");
        setUploading(false);
        return;
      }

      const newImages: VehicleImage[] = [];

      for (const file of fileArray) {
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name} is too large. Max 10MB per file.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("vehicleId", vehicleId);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (!res.ok) {
            setError(data.error || `Failed to upload ${file.name}`);
            continue;
          }

          newImages.push(data);
        } catch {
          setError(`Network error uploading ${file.name}`);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }

      setUploading(false);
    },
    [vehicleId, images, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleDelete = async (imageId: string) => {
    try {
      const res = await fetch(`/api/upload?id=${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = images.filter((img) => img.id !== imageId);
        onImagesChange(updated);
      }
    } catch {
      setError("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    onImagesChange(updated);

    try {
      await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryImageId: imageId }),
      });
    } catch {
      // silent — UI already updated
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <img
                src={img.url}
                alt={img.caption || "Vehicle photo"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />

              {img.isPrimary && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                  <Star className="h-3 w-3 fill-white" />
                  Primary
                </span>
              )}

              <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-amber-600 shadow hover:bg-white"
                    title="Set as primary"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white"
                  title="Delete"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {images.length < 10 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragActive
              ? "border-neutral-800 bg-neutral-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Uploading...
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Drag & drop photos here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG, WebP up to 10MB each. {10 - images.length} slots
                remaining.
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                uploadFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length}/10 photos uploaded. The primary photo appears in search
        results and listings.
      </p>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  type: 'products' | 'categories';
  onUpload: (image: UploadedImage) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export function ImageUploader({ type, onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, WebP, and AVIF images are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be 5MB or smaller.');
      return;
    }

    setUploading(true);

    try {
      const signatureResponse = await fetch('/api/admin/cloudinary/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });

      const signatureData = await readJsonResponse(signatureResponse);

      if (!signatureResponse.ok || !signatureData.success) {
        throw new Error(signatureData.message || 'Unable to prepare upload.');
      }

      const formData = new FormData();

      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey);
      formData.append('timestamp', String(signatureData.timestamp));
      formData.append('signature', signatureData.signature);
      formData.append('folder', signatureData.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const uploadData = await readJsonResponse(uploadResponse);

      if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error('Image upload failed.');
      }

      onUpload({
        url: uploadData.secure_url,
        publicId: uploadData.public_id
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Image upload failed.'
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleFile(file);
          }
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload image'}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <p className="mt-2 text-xs text-[var(--text-muted)]">
        JPG, PNG, WebP or AVIF · Maximum 5MB
      </p>
    </div>
  );
}

async function readJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('Unable to prepare image upload. Please try again.');
  }

  return response.json();
}

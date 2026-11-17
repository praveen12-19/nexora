import { supabase, isSupabaseConfigured } from './supabase';
import { validateImageFile } from '../utils/cloudinary';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const cloudinaryService = {
  /**
   * Upload an image file directly to Cloudinary.
   * Uses signed upload via Supabase Edge Function 'cloudinary-signature',
   * or direct unsigned upload if VITE_CLOUDINARY_UPLOAD_PRESET is specified,
   * or a local data URI preview fallback if in mock mode.
   */
  async uploadImage(file: File): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ufn963cd';
    const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nexora_products';

    // 1. If Supabase is configured and edge function is deployed, request signed upload params
    if (isSupabaseConfigured() && !unsignedPreset) {
      try {
        const { data: signData, error: signError } = await supabase.functions.invoke(
          'cloudinary-signature',
          { body: {} }
        );

        if (!signError && signData?.signature) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', signData.apiKey);
          formData.append('timestamp', signData.timestamp.toString());
          formData.append('signature', signData.signature);
          formData.append('folder', signData.folder || 'nexora_products');

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!uploadRes.ok) {
            const errJson = await uploadRes.json().catch(() => ({}));
            throw new Error(errJson.error?.message || 'Cloudinary upload failed');
          }

          const resData: CloudinaryUploadResponse = await uploadRes.json();
          return resData.secure_url;
        }
      } catch (err) {
        console.warn('Signed upload failed or function not yet deployed:', err);
      }
    }

    // 2. Unsigned Cloudinary upload if preset is provided
    if (cloudName && unsignedPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', unsignedPreset);
        formData.append('folder', 'nexora_products');

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (uploadRes.ok) {
          const resData: CloudinaryUploadResponse = await uploadRes.json();
          return resData.secure_url;
        }
      } catch (err) {
        console.warn('Unsigned upload failed:', err);
      }
    }

    // 3. Fallback for offline / local sandbox testing when Cloudinary secrets aren't set:
    // Read as Base64 Data URL so the user can test adding products and seeing images right away!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Upload multiple images in parallel.
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  },
};

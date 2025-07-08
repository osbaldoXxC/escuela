import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '../../config.js';
import fs from 'fs-extra';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloud_name,
  api_key: CLOUDINARY_CONFIG.api_key,
  api_secret: CLOUDINARY_CONFIG.api_secret
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'escuela/eventos',
      upload_preset: CLOUDINARY_CONFIG.upload_preset,
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    throw error;
  }
};
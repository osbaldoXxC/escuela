import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Osbaldo:Martinez24@cluster0.3ju003b.mongodb.net/escuela?retryWrites=true&w=majority&appName=Cluster0';
export const JWT_SECRET = process.env.JWT_SECRET || 'secretkeyescuela';

// Configuración de Cloudinary desde variables de entorno
export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
};
import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

export function configureCloudinary() {
  if (isConfigured) return cloudinary;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  isConfigured = true;
  return cloudinary;
}

export { cloudinary };
export default configureCloudinary;

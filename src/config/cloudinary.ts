import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDNARY_API_KEY as string,
  api_secret: process.env.CLOUDNARY_API_SECRET as string,
});

export default cloudinary
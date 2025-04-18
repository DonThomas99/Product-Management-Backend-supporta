import { v2 as cloudinary } from 'cloudinary';
import cloudinaryInterface from '../../useCase/interfaces/cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class Cloudinary implements cloudinaryInterface {
  
  async savetoCloudinary(file: Express.Multer.File): Promise<string | null> {
    try {
      const maxBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxBytes) {
        throw new Error("File size too large, Maximum is 10MB");
      }

      // Convert buffer to base64 data URI
      const base64String = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64String}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        quality: 'auto:best',
        folder: 'products' // Optional folder
      });

      return result.secure_url;

    } catch (error) {
      console.log('Cloudinary upload error:', error);
      return null;
    }
  }

  async removeFromCloudinary(publicId: string): Promise<boolean | null> {
    try {
      const status = await cloudinary.uploader.destroy(publicId);
      console.log(status);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default Cloudinary;

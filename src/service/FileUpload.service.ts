import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../error/apiError.js';

export class FileService {
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new ApiError({ statusCode: 400, message: 'No file provided' });
    }
    const fileSource = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const uploadedFile = await cloudinary.uploader.upload(fileSource, {
      folder: 'shoplink/products',
      resource_type: 'auto',
    });
    return uploadedFile.secure_url;
  }
}

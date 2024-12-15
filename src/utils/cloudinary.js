// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { cloudinary_api_key, cloudinary_api_secret, cloudinary_cloud_name } from './secrets';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

export default cloudinary;


export const uploadToCloudinary = (buffer,folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `Jenii${folder}`},
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signifies the end of the stream
    readableStream.pipe(stream);
  });
};
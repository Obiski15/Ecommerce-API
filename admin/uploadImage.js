const { v2 } = require("cloudinary");
const sharp = require("sharp");

const AppError = require("../utils/AppError");

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (fileBuffer) => {
  const resizedBuffer = await sharp(fileBuffer)
    // .resize(196, 196, {
    //   fit: "cover", // Ensures the image fills 196x196
    //   withoutEnlargement: true, // Prevents upscaling smaller images
    // })
    .png({
      compressionLevel: 9, // 0 (fastest, largest) to 9 (slowest, smallest)
      quality: 100, // for image quality tuning
      adaptiveFiltering: true,
      force: true,
    })
    .toBuffer();

  const result = await new Promise((resolve, reject) => {
    v2.uploader
      .upload_stream(
        { folder: "ruvid-store/products" },
        (error, uploadResult) => {
          if (error)
            return reject(
              new AppError(
                "Something went wrong while trying to upload your image",
                500,
              ),
            );

          return resolve(uploadResult);
        },
      )
      .end(resizedBuffer);
  });

  return result.secure_url;
};

module.exports = uploadImage;

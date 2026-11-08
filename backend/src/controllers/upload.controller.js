const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

async function saveLocally(file) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.originalname) || '.bin';
  const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), file.buffer);
  return { url: `/uploads/${filename}`, publicId: filename };
}

async function uploadToCloudinary(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'tactyqal-labs',
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  const result = isCloudinaryConfigured
    ? await uploadToCloudinary(req.file)
    : await saveLocally(req.file);

  return success(res, {
    status: 201,
    message: 'Image uploaded',
    data: result,
  });
});

module.exports = { uploadImage };
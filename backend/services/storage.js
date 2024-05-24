const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, fileExt) + '-' + Date.now() + fileExt;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
};

const resizeImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const imagePath = path.join('public/uploads', req.file.filename);
    const resizedPath = path.join('public/uploads', `resized-${req.file.filename}`);
    const maxSize = 200; // Set the maximum allowed size for the profile image

    try {
        const metadata = await sharp(imagePath).metadata();
        const { width, height } = metadata;

        let resizeWidth, resizeHeight;

        // Calculate the resize dimensions to make the image square
        if (width > height) {
            resizeWidth = maxSize;
            resizeHeight = maxSize;
        } else {
            resizeHeight = maxSize;
            resizeWidth = maxSize;
        }

        await sharp(imagePath)
            .resize(resizeWidth, resizeHeight, {
                kernel: sharp.kernel.nearest,
                fit: 'contain',
                withoutEnlargement: true,
            })
            .extend({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: { r: 255, g: 255, b: 255 }, // Set a white background
            })
            .toFile(resizedPath);

        // Replace the original file with the resized file
        req.file.path = resizedPath;
        req.file.filename = `resized-${req.file.filename}`;
    } catch (err) {
        console.error(err);
        return next(err);
    }

    next();
};

const resizeImages = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const imagePath = path.join('public/uploads', req.file.filename);
    const resizedPath = path.join('public/uploads', `resized-${req.file.filename}`);
    const maxSize = 200; // Set the maximum allowed size for the profile image

    try {
        const metadata = await sharp(imagePath).metadata();
        const { width, height } = metadata;

        const minDimension = Math.min(width, height);
        
        await sharp(imagePath)
            .resize({
                width: minDimension,
                height: minDimension,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .resize(maxSize, maxSize)  // Resize the cropped area to the desired dimensions
            .toFile(resizedPath);

        // Replace the original file with the resized file
        req.file.path = resizedPath;
        req.file.filename = `resized-${req.file.filename}`;
    } catch (err) {
        console.error(err);
        return next(err);
    }

    next();
};

//const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single('profileImage');
const storage = multer({ storage: diskStorage });

module.exports = { resizeImage, storage, resizeImages };

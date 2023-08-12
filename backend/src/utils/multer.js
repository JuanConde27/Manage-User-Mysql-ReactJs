import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(import.meta.url.split('/').slice(3, -1).join('/'), '../static/image'));
    },
    filename: (req, file, cb) => {
        cb(null, `image${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage,
    fileFilter
});

export default upload;

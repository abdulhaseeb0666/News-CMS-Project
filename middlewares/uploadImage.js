import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

const limits = {
    fileSize: 1024 * 1024 * 3
}

const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
} else {
    cb(null, false);
}
};

const upload = multer({ 
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

export default upload;
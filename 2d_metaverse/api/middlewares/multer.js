import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/temp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const upload = multer({ storage });

export { upload };

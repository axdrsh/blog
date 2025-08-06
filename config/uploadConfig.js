// config/uploadConfig.js
import multer from "multer";
import path from "path";

// set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // folder where files will be saved
  filename: function (req, file, cb) {
    // create a unique filename to avoid conflicts
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// check file type
function checkFileType(file, cb) {
  // allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("error: images only!");
  }
}

// init upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit file size to 2mb
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("postImage"); // 'postImage' is the field name in the form-data

export default upload;

// upload.js
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const shortid = require('shortid');
const { conn } = require('./db');

const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return {
      filename: `${shortid.generate()}-${Date.now()}-${file.originalname}`,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({ storage });

module.exports = upload;

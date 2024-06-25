// db.js
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const conn = mongoose.createConnection('mongodb+srv://manohar:manohar@cluster0.nywirg5.mongodb.net/e-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;
let gridfsBucket;

conn.once('open', () => {
  gridfsBucket = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = gridfsBucket;
});

module.exports = { mongoose, conn, gfs, gridfsBucket };

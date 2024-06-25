const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');

const app = express();
const port = 3000; // Or any port you prefer

// MongoDB connection URI
const mongoURI = 'mongodb+srv://manohar:manohar@cluster0.nywirg5.mongodb.net/newDB';

// Create Mongo client
const client = new MongoClient(mongoURI);

// Initialize connection and start server
async function startServer() {
    try {
        await client.connect();
        console.log('MongoDB connected successfully');

        const db = client.db('e-commerce');
        const collectionName = 'e-commerce';
        const bucket = new GridFSBucket(db, {
            bucketName: collectionName
        });

        // Multer setup for file upload
        const storage = multer.memoryStorage();
        const upload = multer({ storage });

        // POST endpoint for uploading image
        app.post('/upload', upload.single('image'), async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const filename = req.file.originalname;
                const uploadStream = bucket.openUploadStream(filename);
                uploadStream.end(req.file.buffer);

                uploadStream.on('finish', async () => {
                    const fileId = uploadStream.id; // Get the ObjectId of the uploaded file
                    const fileUrl = `/image/${fileId}`; // Construct the URL to access the image

                    res.json({ file: filename, message: 'File uploaded successfully', url: fileUrl });
                });

                uploadStream.on('error', (err) => {
                    console.error('Error uploading file:', err);
                    res.status(500).json({ error: 'Failed to upload file' });
                });
            } catch (err) {
                console.error('Error uploading file:', err);
                res.status(500).json({ error: 'Failed to upload file' });
            }
        });

        // GET endpoint for retrieving image
        app.get('/image/:id', (req, res) => {
            const fileId = new ObjectId(req.params.id);
            bucket.openDownloadStream(fileId)
                .pipe(res)
                .on('error', () => res.status(404).json({ error: 'File not found' }));
        });

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

        console.log('Server setup completed. Ready to handle requests.');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit if connection fails
    }
}

// Call the async function to start the server
startServer();

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
const PORT = process.env.PORT;
const app = express();


app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {

    const dir = './images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname);
  }
});

const upload = multer({ storage: fileStorageEngine });

app
.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
})


.post('/singleUpload', upload.single('image'), async(req, res) => {
  if (req.file) {
    console.log('Uploaded File:', req.file);
    res.send('Single File Upload Success');
    const filePath = path.join(__dirname, 'images', req.file.filename);
    const compressedFilePath = path.join(__dirname,'compressed', 'compressed-' + req.file.filename);
  
    try {

      await sharp(filePath)
        .resize(800) 
        .toFile(compressedFilePath);
  

    fs.unlinkSync(filePath);
  
    const imageUrl = `/compressed-${req.file.filename}`;
    res.send(`
      <h3>File uploaded and compressed successfully!</h3>
      <p>Click below to view the compressed image:</p>
      <img src="${imageUrl}" alt="Compressed Image">
    `);
    } catch (error) {
      res.status(500).send('Failed to compress the image');
    }
  } else {
    res.status(400).send('No file uploaded');
  }
})


.post('/multipleUpload', upload.array('images', 3), (req, res) => {
  if (req.files) {
    console.log('Uploaded Files:', req.files);
    res.send('Multiple Files Upload Success');
  } else {
    res.status(400).send('No files uploaded');
  }
})


app.listen(PORT, () => {
  console.log('Server running on port 5000');
})

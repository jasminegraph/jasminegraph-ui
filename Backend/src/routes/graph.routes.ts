import { Router } from 'express';
import { getGraphList, uploadGraph, removeGraph, triangleCount } from '../controllers/graph.controller';
import multer from 'multer';
import path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // Specify the folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
  }
});

const upload = multer({ storage: storage });

const graphRoute = () => {
  const router = Router();

  router.get('/list', getGraphList);
  router.post('/upload', upload.single("file"), uploadGraph);
  router.delete('/:id', removeGraph);
  router.post('/analyze/trianglecount', triangleCount)

  return router;
};

export { graphRoute };
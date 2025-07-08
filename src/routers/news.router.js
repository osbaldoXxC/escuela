import { Router } from 'express';
import { 
  getLatestNews,
  getNextNews,
  createNews, getThreeLatestNews ,
  updateNews,getAllNews  
} from '../controllers/news.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const router = Router();
router.get('/', getAllNews);
// Nuevos endpoints
router.get('/latest', getLatestNews); // Primeras 5 noticias
router.get('/next', getNextNews); // Siguientes 5 noticias
router.get('/latest-three', getThreeLatestNews);
// Endpoints existentes
router.post('/', authenticate, upload.array('images', 5), createNews);
router.put('/:id', authenticate, upload.array('images', 5), updateNews);

export default router;
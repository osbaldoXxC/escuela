import { Router } from 'express';
import { 
  getAllTeachers,
  createTeacher,
  updateTeacher
} from '../controllers/teacher.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const router = Router();

router.get('/', getAllTeachers);
router.post('/', authenticate, upload.single('image'), createTeacher);
router.put('/:id', authenticate, upload.single('image'), updateTeacher);

export default router;
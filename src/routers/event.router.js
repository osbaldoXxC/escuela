import { Router } from 'express';
import { 
  getAllEventsBasic, 
  getEventById,
  createEvent,
  updateEvent,getTwoLatestEvents
} from '../controllers/event.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/latest-two', getTwoLatestEvents);
router.get('/', getAllEventsBasic);
router.get('/:id', getEventById);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);

export default router;
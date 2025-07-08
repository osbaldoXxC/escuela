import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
// Endpoint protegido de prueba
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user, // Datos del usuario del token
    message: "Acceso a ruta protegida exitoso"
  });
});

export default router;
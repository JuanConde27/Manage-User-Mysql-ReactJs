import express from 'express';
import { register, register_users ,login, getAllUsers, getUserById, updateUser, deleteUser, forgotPassword, resetPassword, register_users_password, updatePassword } from '../controllers/UsersController.js';
import validateJwt from '../middleware/jwt.js';
import upload from '../utils/multer.js';
const router = express.Router();

//crear las rutas
router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register_users', [validateJwt], register_users);
router.post('/register_users_password/:token', upload.single('photo'), register_users_password);
router.get('/users', [validateJwt], getAllUsers);
router.get('/users/:id', [validateJwt], getUserById);
router.put('/users/uptade/:id', [validateJwt], upload.single('photo'), updateUser);
router.delete('/users/delete/:id', [validateJwt], deleteUser);
router.put('/users/update-password/:id', [validateJwt], updatePassword);

export default router;




import express from 'express';
import authRouter from './auth.route.js';
import productRouter from './product.route.js';
import storeRouter from './store.route.js';

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/stores', storeRouter);

export default router;

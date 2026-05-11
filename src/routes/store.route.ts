import express from 'express';
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  getUserStores,
  getStoreBySlug,
} from '../controller/store.controller.js';
import { RequestValidation } from '../validation/validate.js';
import {
  createStoreSchema,
  updateStoreSchema,
  getStoreSchema,
  getUserStoresSchema,
  getStoreBySlugSchema,
} from '../validation/store.validate.js';
import { protect } from '../middleware/Protect.js';

const storeRouter = express.Router();

storeRouter.get('/vendors', getAllStores);
storeRouter.get('/user/:userId', RequestValidation(getUserStoresSchema), getUserStores);
storeRouter.get('/slug/:slug', RequestValidation(getStoreBySlugSchema), getStoreBySlug);
storeRouter.get('/:id', RequestValidation(getStoreSchema), getStoreById);
storeRouter.post('/', RequestValidation(createStoreSchema), createStore);

storeRouter.use(protect); // Protect all routes below this middleware
storeRouter.put('/:id', RequestValidation(updateStoreSchema), updateStore);
storeRouter.delete('/:id', RequestValidation(getStoreSchema), deleteStore);

export default storeRouter;

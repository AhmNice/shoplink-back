import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByStore,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from '../controller/product.controller.js';
import { RequestValidation } from '../validation/validate.js';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getStoreProductsSchema,
} from '../validation/product.validate.js';
import { upload } from '../util/uploader.js';
import { protect } from '../middleware/Protect.js';

const productRouter = express.Router();

// Public routes (listed first)
productRouter.get('/', getAllProducts);
productRouter.get('/store/:storeId', RequestValidation(getStoreProductsSchema), getProductsByStore);
productRouter.get('/:id', RequestValidation(getProductSchema), getProductById);

// Protected routes
productRouter.use(protect); // Apply authentication middleware to all routes below
productRouter.post(
  '/',
  upload.single('productImage'),
  RequestValidation(createProductSchema),
  createProduct,
);
productRouter.put('/:id', RequestValidation(updateProductSchema), updateProduct);
productRouter.delete('/:id', RequestValidation(getProductSchema), deleteProduct);
productRouter.patch(
  '/:id/toggle-active',

  RequestValidation(getProductSchema),
  toggleProductActive,
);

export default productRouter;

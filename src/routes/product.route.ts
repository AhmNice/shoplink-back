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

const productRouter = express.Router();

productRouter.post('/',upload.single('productImage'), RequestValidation(createProductSchema), createProduct);
productRouter.get('/', getAllProducts);
productRouter.get('/store/:storeId', RequestValidation(getStoreProductsSchema), getProductsByStore);
productRouter.get('/:id', RequestValidation(getProductSchema), getProductById);
productRouter.put('/:id', RequestValidation(updateProductSchema), updateProduct);
productRouter.delete('/:id', RequestValidation(getProductSchema), deleteProduct);
productRouter.patch('/:id/toggle-active', RequestValidation(getProductSchema), toggleProductActive);

export default productRouter;

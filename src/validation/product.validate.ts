import z from 'zod';

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Product name is required' }),
    description: z.string().optional(),
    price: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, { message: 'Price must be a positive number' })
      .optional(),
    image: z.string().min(1, { message: 'Product image is required' }).optional(),
    originalPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, { message: 'Price must be a positive number' })
      .optional(),
    storeId: z.string().min(1, { message: 'Store ID is required' }),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Product name is required' }).optional(),
    description: z.string().optional(),
    price: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, { message: 'Price must be a positive number' })
      .optional(),
    image: z.string().min(1, { message: 'Product image is required' }).optional(),
    isActive: z.boolean().optional(),
    originalPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, { message: 'Price must be a positive number' })
      .optional(),
  }),
});

const getProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'Product ID is required' }),
  }),
});

const getStoreProductsSchema = z.object({
  params: z.object({
    storeId: z.string().min(1, { message: 'Store ID is required' }),
  }),
});

export { createProductSchema, updateProductSchema, getProductSchema, getStoreProductsSchema };

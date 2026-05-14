import z from 'zod';

const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Store name is required' }),
    description: z.string().optional(),
    userId: z.string().min(1, { message: 'User ID is required' }),
    address: z.string().optional(),
    phone: z.string().optional(),
    category: z.string().optional(),
    logo: z.string().optional(),
    deliveryTime: z.string().optional(),
    minOrder: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: 'Minimum Order price should be greater than 0',
      })
      .optional(),
    deliveryFee: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: 'Delivery fee should be greater than 0',
      })
      .optional(),
  }),
});

const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    category: z.string().optional(),
    logo: z.string().optional(),
    deliveryTime: z.string().optional(),
    minOrder: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: 'Minimum Order price should be greater than 0',
      })
      .optional(),
    deliveryFee: z
      .string()
      .transform((val) => parseFloat(val))
      .refine((val) => val > 0, {
        message: 'Delivery fee should be greater than 0',
      })
      .optional(),
  }),
});

const getStoreSchema = z.object({
  params: z.object({ id: z.string().min(1, { message: 'Store ID is required' }) }),
});

const getUserStoresSchema = z.object({
  params: z.object({ userId: z.string().min(1, { message: 'User ID is required' }) }),
});

const getStoreBySlugSchema = z.object({
  params: z.object({ slug: z.string().min(1, { message: 'Slug is required' }) }),
  query: z.object({ userId: z.string().optional() }).optional(),
});

export {
  createStoreSchema,
  updateStoreSchema,
  getStoreSchema,
  getUserStoresSchema,
  getStoreBySlugSchema,
};

export interface CreateStoreInput {
  name: string;
  description?: string;
  userId: string;
  address?: string;
  phone?: string;
  category?: string;
  logo?: string;
  deliveryTime?: string;
  minOrder?: number;
  deliveryFee?: number;
}
export interface UpdateStoreInput {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  category?: string;
  logo?: string;
   deliveryTime?: string;
  minOrder?: number;
  deliveryFee?: number;
}
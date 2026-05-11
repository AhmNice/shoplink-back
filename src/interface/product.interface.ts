export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  image: string;
  originalPrice?: number;
  storeId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isActive?: boolean;
  originalPrice?: number;
}

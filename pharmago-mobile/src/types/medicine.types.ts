export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Medicine {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  brand: string;
  description: string;
  composition: string;
  dosageForm: string;
  packSize: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  stockQuantity: number;
  inStock: boolean;
  prescriptionRequired: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MedicineFilterParams {
  categoryId?: number;
  prescriptionRequired?: boolean;
  inStockOnly?: boolean;
  searchQuery?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

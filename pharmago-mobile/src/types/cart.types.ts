export interface CartItem {
  id: number;
  medicineId: number;
  medicineName: string;
  brand: string;
  dosageForm: string;
  packSize: string;
  prescriptionRequired: boolean;
  availableStock: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  requiresPrescription: boolean;
}

export interface AddToCartPayload {
  medicineId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

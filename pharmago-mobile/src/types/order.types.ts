export type OrderStatus = 'ORDERED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'UPI' | 'CREDIT_CARD';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface OrderItem {
  id: number;
  medicineId: number;
  medicineName: string;
  brand: string;
  dosageForm: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  totalAmount: number;
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

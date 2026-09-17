export type PrescriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Prescription {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  orderId?: number;
  orderNumber?: string;
  fileName: string;
  fileUrl: string;
  originalFileName: string;
  fileSize: number;
  status: PrescriptionStatus;
  adminNotes?: string;
  uploadedAt: string;
  reviewedAt?: string;
}

export type PrescriptionResponse = Prescription;

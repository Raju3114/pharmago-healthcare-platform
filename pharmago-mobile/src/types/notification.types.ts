export type NotificationType = 'ORDER_UPDATE' | 'PRESCRIPTION_UPDATE' | 'PROMOTION';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  referenceId?: number;
  createdAt: string;
}

export type NotificationItem = Notification;

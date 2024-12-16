export interface Payment {
  id: number;
  amount: number;
  type: 'rent' | 'maintenance' | 'utility';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
}

export const mockPayments: Payment[] = [
  {
    id: 1,
    amount: 5000000,
    type: 'rent',
    status: 'pending',
    dueDate: '2024-01-30'
  },
  {
    id: 2,
    amount: 2000000,
    type: 'maintenance',
    status: 'paid',
    dueDate: '2024-01-15'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Thông Báo Bảo Trì',
    content: 'Sẽ tiến hành sửa chữa hệ thống điện tầng 3',
    date: '2024-01-20'
  },
  {
    id: 2,
    title: 'Gia Hạn Hợp Đồng',
    content: 'Vui lòng liên hệ văn phòng để gia hạn hợp đồng',
    date: '2024-01-25'
  }
];

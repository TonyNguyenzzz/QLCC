export interface DashboardData {
  totalResidents: number;
  totalBuildings: number;
  pendingMaintenance: number;
  pendingPayments: number;
  occupancyRate: number;
  monthlyRevenue: number;
  recentNotifications: {
    id: number;
    title: string;
    time: string;
  }[];
}

export const dashboardData: DashboardData = {
  totalResidents: 150,
  totalBuildings: 5,
  pendingMaintenance: 3,
  pendingPayments: 2,
  occupancyRate: 85,
  monthlyRevenue: 750000000, // VND
  recentNotifications: [
    { id: 1, title: 'Bảo trì hệ thống điện', time: '2 giờ trước' },
    { id: 2, title: 'Thông báo họp cư dân', time: '1 ngày trước' },
    { id: 3, title: 'Cập nhật quy định mới', time: '2 ngày trước' },
  ],
};

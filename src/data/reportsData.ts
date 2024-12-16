// src/data/reportsData.ts

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface Report {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface ReportsData {
  reports: Report[];
  monthlyRevenue: MonthlyRevenue[];
  apartmentStatus: StatusData[];
  repairsStatus: StatusData[];
}

const reportsData: ReportsData = {
  reports: [
    { id: 1, title: 'Báo cáo 1', description: 'Mô tả báo cáo 1', createdAt: '2024-01-01' },
    { id: 2, title: 'Báo cáo 2', description: 'Mô tả báo cáo 2', createdAt: '2024-02-01' },
    // Thêm các báo cáo mẫu khác nếu cần
  ],
  monthlyRevenue: [
    { month: 'Jan', amount: 4000 },
    { month: 'Feb', amount: 3000 },
    { month: 'Mar', amount: 5000 },
    { month: 'Apr', amount: 4000 },
    { month: 'May', amount: 6000 },
    { month: 'Jun', amount: 7000 },
    { month: 'Jul', amount: 5500 },
    { month: 'Aug', amount: 6500 },
    { month: 'Sep', amount: 7000 },
    { month: 'Oct', amount: 8000 },
    { month: 'Nov', amount: 7500 },
    { month: 'Dec', amount: 9000 },
  ],
  apartmentStatus: [
    { name: 'Đang Sử Dụng', value: 70 },
    { name: 'Trống', value: 20 },
    { name: 'Đang Sửa Chữa', value: 10 },
  ],
  repairsStatus: [
    { name: 'Đang tiến hành', value: 12 },
    { name: 'Hoàn thành', value: 8 },
    { name: 'Chưa bắt đầu', value: 5 },
  ],
};

export default reportsData;

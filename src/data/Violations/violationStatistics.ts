import { ResidencyHistory } from '../../types/residency';

export const mockViolationStatistics: ResidencyHistory[] = [
  {
    id: 'RH001',
    residentId: 'R001',
    resident: {
      id: 'R001',
      name: 'Nguyễn Văn A',
      identityNumber: '123456789',
      phoneNumber: '0901234567',
      email: 'vana@example.com'
    },
    buildingId: 'B001',
    apartmentId: '101',
    startDate: new Date('2023-01-01'),
    leaseType: 'rent',
    contractNumber: 'CN001',
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-15'),
    utilities: [
      {
        type: 'electricity',
        included: true,
        monthlyFee: 500000
      },
      {
        type: 'water',
        included: true,
        monthlyFee: 200000
      }
    ],
    occupants: [
      {
        name: 'Nguyễn Văn A',
        relationship: 'Chủ hộ',
        identityNumber: '123456789',
        phoneNumber: '0901234567'
      }
    ],
    violations: [
      {
        date: new Date('2024-01-15T22:30:00'),
        type: 'Tiếng Ồn',
        description: 'Phát nhạc lớn sau 22h',
        status: 'resolved',
        resolution: 'Nhắc nhở và yêu cầu giảm âm lượng'
      },
      {
        date: new Date('2024-02-20T18:45:00'),
        type: 'Rác Thải',
        description: 'Xả rác không đúng nơi quy định',
        status: 'pending'
      }
    ]
  },
  {
    id: 'RH002',
    residentId: 'R002',
    resident: {
      id: 'R002',
      name: 'Trần Thị B',
      identityNumber: '987654321',
      phoneNumber: '0907654321',
      email: 'thib@example.com'
    },
    buildingId: 'B001',
    apartmentId: '202',
    startDate: new Date('2023-02-01'),
    leaseType: 'rent',
    contractNumber: 'CN002',
    status: 'active',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-03-10'),
    utilities: [
      {
        type: 'internet',
        included: false,
        monthlyFee: 150000
      },
      {
        type: 'parking',
        included: true
      }
    ],
    occupants: [
      {
        name: 'Trần Thị B',
        relationship: 'Chủ hộ',
        identityNumber: '987654321',
        phoneNumber: '0907654321'
      }
    ],
    violations: [
      {
        date: new Date('2024-03-10T07:15:00'),
        type: 'Gửi Xe',
        description: 'Để xe sai vị trí quy định',
        status: 'resolved',
        resolution: 'Di chuyển xe đúng vị trí'
      }
    ]
  },
  {
    id: 'RH003',
    residentId: 'R003',
    resident: {
      id: 'R003',
      name: 'Lê Văn C',
      identityNumber: '567891234',
      phoneNumber: '0903456789',
      email: 'vanc@example.com'
    },
    buildingId: 'B002',
    apartmentId: '303',
    startDate: new Date('2023-03-01'),
    leaseType: 'rent',
    contractNumber: 'CN003',
    status: 'active',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-04-12'),
    utilities: [
      {
        type: 'other',
        included: true,
        monthlyFee: 100000
      }
    ],
    occupants: [
      {
        name: 'Lê Văn C',
        relationship: 'Chủ hộ',
        identityNumber: '567891234',
        phoneNumber: '0903456789'
      }
    ],
    violations: [
      {
        date: new Date('2024-04-05T23:00:00'),
        type: 'An Ninh',
        description: 'Khách không đăng ký ra vào sau 22h',
        status: 'pending'
      },
      {
        date: new Date('2024-04-12T19:30:00'),
        type: 'Hành Lang',
        description: 'Để đồ cá nhân chiếm hành lang',
        status: 'resolved',
        resolution: 'Dọn dẹp đồ đạc khỏi hành lang'
      }
    ]
  }
];

// Hàm để lấy thống kê vi phạm theo loại
export const getViolationStatisticsByType = () => {
  const typeStats: { [key: string]: number } = {};
  
  mockViolationStatistics.forEach(history => {
    history.violations?.forEach(violation => {
      typeStats[violation.type] = (typeStats[violation.type] || 0) + 1;
    });
  });
  
  return typeStats;
};

// Hàm để lấy thống kê vi phạm theo trạng thái
export const getViolationStatisticsByStatus = () => {
  const statusStats: { [key: string]: number } = {
    resolved: 0,
    pending: 0
  };
  
  mockViolationStatistics.forEach(history => {
    history.violations?.forEach(violation => {
      statusStats[violation.status]++;
    });
  });
  
  return statusStats;
};

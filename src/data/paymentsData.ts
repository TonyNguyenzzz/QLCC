import { Payment, PaymentType, PaymentStatus, PaymentMethod } from '../types/payment';
import { Building, BuildingStatus } from '../types/building';

const buildingsData: Building[] = [
  {
    id: 1,
    name: "Tòa nhà A",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    totalFloors: 20,
    totalUnits: 100,
    occupiedUnits: 85,
    maintenanceRequests: 5,
    amenities: ['parking', 'pool', 'gym', 'security'],
    status: BuildingStatus.Active,
    description: 'Tòa nhà cao cấp với đầy đủ tiện nghi hiện đại',
    yearBuilt: '2020',
    parkingSpaces: 120,
    monthlyRevenue: 500000000
  },
  {
    id: 2,
    name: "Tòa nhà B",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    totalFloors: 15,
    totalUnits: 80,
    occupiedUnits: 60,
    maintenanceRequests: 3,
    amenities: ['parking', 'security', 'restaurant'],
    status: BuildingStatus.Maintenance,
    description: 'Tòa nhà văn phòng kết hợp căn hộ',
    yearBuilt: '2018',
    parkingSpaces: 80,
    monthlyRevenue: 400000000
  }
];

const paymentsData: Payment[] = [
  {
    id: 1,
    residentName: 'Nguyễn Văn A',
    apartmentId: 'A101',
    buildingId: 'B1',
    amount: 5000000,
    type: PaymentType.Rent,
    dueDate: new Date('2024-01-15'),
    status: PaymentStatus.Completed,
    paymentMethod: PaymentMethod.BankTransfer,
    paidDate: new Date('2024-01-15')
  },
  {
    id: 2,
    residentName: 'Trần Thị B',
    apartmentId: 'B202',
    buildingId: 'B2',
    amount: 3500000,
    type: PaymentType.Utility,
    dueDate: new Date('2024-01-20'),
    status: PaymentStatus.Completed,
    paymentMethod: PaymentMethod.Cash,
    paidDate: new Date('2024-01-20')
  },
  {
    id: 3,
    residentName: 'Lê Văn C',
    apartmentId: 'C303',
    buildingId: 'B3',
    amount: 6000000,
    type: PaymentType.Rent,
    dueDate: new Date('2024-01-25'),
    status: PaymentStatus.Pending,
    paymentMethod: PaymentMethod.BankTransfer,
    paidDate: null
  }
];

export { buildingsData, paymentsData };

import { useState, useEffect } from 'react';
import { Payment, PaymentStatus, PaymentType, PaymentMethod } from '../types/payment';
import { Building, BuildingStatus } from '../types/building';

export const usePaymentData = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    // Mock Buildings
    const mockBuildings: Building[] = [
      {
        id: 1,
        name: 'Tòa A',
        address: '123 Đường ABC, Quận 1',
        totalFloors: 20,
        totalUnits: 200,
        occupiedUnits: 180,
        maintenanceRequests: 5,
        amenities: ['Bể bơi', 'Phòng gym'],
        status: BuildingStatus.Active,
        description: 'Tòa nhà cao cấp tại trung tâm',
        yearBuilt: '2018',
        parkingSpaces: 100,
        monthlyRevenue: 500000000
      },
      {
        id: 2,
        name: 'Tòa B',
        address: '456 Đường XYZ, Quận 2',
        totalFloors: 15,
        totalUnits: 150,
        occupiedUnits: 120,
        maintenanceRequests: 3,
        amenities: ['Sân tennis', 'Khu vui chơi trẻ em'],
        status: BuildingStatus.Active,
        description: 'Tòa nhà dành cho gia đình',
        yearBuilt: '2020',
        parkingSpaces: 80,
        monthlyRevenue: 350000000
      }
    ];

    // Mock Payments
    const mockPayments: Payment[] = Array(50).fill(null).map((_, index) => ({
      id: index + 1,
      residentName: `Cư dân ${index + 1}`,
      apartmentId: `A${Math.floor(Math.random() * 200) + 1}`,
      buildingId: Math.random() > 0.5 ? '1' : '2',
      amount: Math.floor(Math.random() * 50000) + 5000,
      type: [
        PaymentType.Rent, 
        PaymentType.Maintenance, 
        PaymentType.Utility, 
        PaymentType.Other
      ][Math.floor(Math.random() * 4)],
      dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      status: [
        PaymentStatus.Pending, 
        PaymentStatus.Completed, 
        PaymentStatus.Overdue
      ][Math.floor(Math.random() * 3)],
      paymentMethod: [
        PaymentMethod.Cash, 
        PaymentMethod.BankTransfer, 
        PaymentMethod.CreditCard
      ][Math.floor(Math.random() * 3)],
      description: `Thanh toán ${['tiền nhà', 'phí dịch vụ', 'bảo trì'][Math.floor(Math.random() * 3)]}`
    }));

    setBuildings(mockBuildings);
    setPayments(mockPayments);
  }, []);

  return { payments, buildings };
};

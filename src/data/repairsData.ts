interface Repair {
  id: number;
  apartment: string;
  description: string;
  status: string;
}

const repairsData: Repair[] = [
  { id: 1, apartment: 'A1', description: 'Sửa chữa hệ thống điện', status: 'Đang tiến hành' },
  { id: 2, apartment: 'B2', description: 'Thay mới cửa sổ', status: 'Hoàn thành' },
  { id: 3, apartment: 'C3', description: 'Bảo dưỡng hệ thống nước', status: 'Đang tiến hành' },
  { id: 4, apartment: 'D4', description: 'Sửa chữa sàn nhà', status: 'Chưa bắt đầu' },
  { id: 5, apartment: 'E5', description: 'Thay mới thiết bị vệ sinh', status: 'Đang tiến hành' },
  { id: 6, apartment: 'F6', description: 'Bảo trì hệ thống điều hòa', status: 'Hoàn thành' },
  { id: 7, apartment: 'G7', description: 'Sửa chữa trần nhà', status: 'Chưa bắt đầu' },
  { id: 8, apartment: 'H8', description: 'Thay đổi bố trí phòng khách', status: 'Đang tiến hành' },
  { id: 9, apartment: 'I9', description: 'Bảo dưỡng hệ thống an ninh', status: 'Hoàn thành' },
  { id: 10, apartment: 'J10', description: 'Sửa chữa cửa chính', status: 'Chưa bắt đầu' },
];

export default repairsData;
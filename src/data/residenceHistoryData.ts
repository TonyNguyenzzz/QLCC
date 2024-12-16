interface ResidenceRecord {
  id: number;
  resident: string;
  apartment: string;
  moveIn: string;
  moveOut: string;
  dateOfBirth: string; // Ngày sinh
  contact: string; // Số điện thoại hoặc email
  reasonForMove: string; // Lý do di chuyển
  previousApartment?: string; // Căn hộ trước đây, nếu có
  familySize: number; // Số người trong gia đình
  notes?: string; // Ghi chú thêm
}

const residenceHistoryData: ResidenceRecord[] = [
  { 
    id: 1, 
    resident: 'Nguyễn Văn A', 
    apartment: 'A1', 
    moveIn: '2023-01-01', 
    moveOut: '2023-06-30', 
    dateOfBirth: '1990-05-15', 
    contact: '0901234567', 
    reasonForMove: 'Công việc mới tại thành phố', 
    previousApartment: 'A2', 
    familySize: 3, 
    notes: 'Chuyển ra do công việc thay đổi'
  },
  { 
    id: 2, 
    resident: 'Trần Thị B', 
    apartment: 'B2', 
    moveIn: '2023-02-15', 
    moveOut: '2023-08-20', 
    dateOfBirth: '1995-07-25', 
    contact: '0912345678', 
    reasonForMove: 'Học tập', 
    familySize: 2 
  },
  { 
    id: 3, 
    resident: 'Lê Văn C', 
    apartment: 'C3', 
    moveIn: '2023-03-10', 
    moveOut: '2023-09-25', 
    dateOfBirth: '1988-03-30', 
    contact: '0987654321', 
    reasonForMove: 'Thay đổi nơi ở', 
    previousApartment: 'C2', 
    familySize: 4 
  },
  { 
    id: 4, 
    resident: 'Phạm Thị D', 
    apartment: 'D4', 
    moveIn: '2023-04-05', 
    moveOut: '2023-10-15', 
    dateOfBirth: '1992-11-18', 
    contact: '0908765432', 
    reasonForMove: 'Chuyển đến gần nơi làm việc', 
    familySize: 1 
  },
  { 
    id: 5, 
    resident: 'Hoàng Văn E', 
    apartment: 'E5', 
    moveIn: '2023-05-20', 
    moveOut: '2023-11-30', 
    dateOfBirth: '1985-02-28', 
    contact: '0976543210', 
    reasonForMove: 'Cần không gian rộng hơn', 
    previousApartment: 'E4', 
    familySize: 5 
  },
  { 
    id: 6, 
    resident: 'Vũ Thị F', 
    apartment: 'F6', 
    moveIn: '2023-06-25', 
    moveOut: '2023-12-10', 
    dateOfBirth: '1993-09-05', 
    contact: '0965432109', 
    reasonForMove: 'Mới kết hôn', 
    familySize: 2 
  },
];

export default residenceHistoryData;

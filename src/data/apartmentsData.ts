// src/data/apartmentsData.ts
interface Apartment {
  id: number;
  number: string;
  status: string;
  history: string;
}

const apartmentsData: Apartment[] = [
  { id: 1, number: 'A1', status: 'Đang Sử Dụng', history: 'Nguyễn Văn A' },
  { id: 2, number: 'B2', status: 'Trống', history: 'Trần Thị B' },
  { id: 3, number: 'C3', status: 'Đang Sửa Chữa', history: 'Lê Văn C' },
  { id: 4, number: 'D4', status: 'Đang Sử Dụng', history: 'Phạm Thị D' },
  { id: 5, number: 'E5', status: 'Trống', history: 'Hoàng Văn E' },
  { id: 6, number: 'F6', status: 'Đang Sử Dụng', history: 'Vũ Thị F' },
  { id: 7, number: 'G7', status: 'Đang Sửa Chữa', history: 'Đặng Văn G' },
  { id: 8, number: 'H8', status: 'Trống', history: 'Bùi Thị H' },
  { id: 9, number: 'I9', status: 'Đang Sử Dụng', history: 'Trịnh Văn I' },
  { id: 10, number: 'J10', status: 'Trống', history: 'Đỗ Thị K' },
  { id: 11, number: 'K11', status: 'Đang Sử Dụng', history: 'Nguyễn Văn L' },
  { id: 12, number: 'L12', status: 'Trống', history: 'Trần Thị M' },
  { id: 13, number: 'M13', status: 'Đang Sửa Chữa', history: 'Lê Văn N' },
  { id: 14, number: 'N14', status: 'Đang Sử Dụng', history: 'Phạm Thị O' },
  { id: 15, number: 'O15', status: 'Trống', history: 'Hoàng Văn P' },
  { id: 16, number: 'P16', status: 'Đang Sử Dụng', history: 'Vũ Thị Q' },
  { id: 17, number: 'Q17', status: 'Đang Sửa Chữa', history: 'Đặng Văn R' },
  { id: 18, number: 'R18', status: 'Trống', history: 'Bùi Thị S' },
  { id: 19, number: 'S19', status: 'Đang Sử Dụng', history: 'Trịnh Văn T' },
  { id: 20, number: 'T20', status: 'Trống', history: 'Đỗ Thị U' },
];

export default apartmentsData;

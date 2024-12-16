// src/data/notificationsData.ts
interface Notification {
  id: number;
  message: string;
  date: string;
  type: 'Bảo trì' | 'Sửa chữa' | 'Thay mới' | 'Kiểm tra' | 'Hoàn thành' | 'Khác';
  severity: 'Thông báo' | 'Cảnh báo' | 'Khẩn cấp';
  relatedApartment?: string;
  relatedBuilding?: string;
  notes?: string;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    message: 'Hệ thống điều hòa của căn hộ A1 sẽ được bảo trì vào ngày 20/12/2024.',
    date: '2024-12-01',
    type: 'Bảo trì',
    severity: 'Thông báo',
    relatedApartment: 'A1',
    relatedBuilding: 'Tòa Nhà A',
    notes: 'Người thuê cần tạm thời không sử dụng điều hòa trong ngày bảo trì.'
  },
  {
    id: 2,
    message: 'Thay mới cửa sổ căn hộ B2 hoàn thành.',
    date: '2024-12-02',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'B2',
    relatedBuilding: 'Tòa Nhà B',
    notes: 'Cửa sổ mới đã được kiểm tra và đảm bảo an toàn.'
  },
  {
    id: 3,
    message: 'Sửa chữa hệ thống nước của căn hộ C3 sẽ bắt đầu vào ngày 25/12/2024.',
    date: '2024-12-03',
    type: 'Sửa chữa',
    severity: 'Cảnh báo',
    relatedApartment: 'C3',
    relatedBuilding: 'Tòa Nhà C',
    notes: 'Trong quá trình sửa chữa, căn hộ sẽ không có nước trong khoảng 4 tiếng.'
  },
  {
    id: 4,
    message: 'Căn hộ D4 đang trong quá trình sửa chữa sàn nhà.',
    date: '2024-12-04',
    type: 'Sửa chữa',
    severity: 'Thông báo',
    relatedApartment: 'D4',
    relatedBuilding: 'Tòa Nhà D',
    notes: 'Cần di chuyển đồ đạc ra khỏi khu vực sàn đang sửa.'
  },
  {
    id: 5,
    message: 'Thiết bị vệ sinh của căn hộ E5 đã được thay mới.',
    date: '2024-12-05',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'E5',
    relatedBuilding: 'Tòa Nhà E',
    notes: 'Thiết bị vệ sinh mới đảm bảo tiêu chuẩn an toàn.'
  },
  {
    id: 6,
    message: 'Thang máy của tòa nhà G7 đang được sửa chữa.',
    date: '2024-12-06',
    type: 'Sửa chữa',
    severity: 'Cảnh báo',
    relatedBuilding: 'Tòa Nhà G',
    notes: 'Trong thời gian này, cư dân vui lòng sử dụng thang bộ.'
  },
  {
    id: 7,
    message: 'Căn hộ H8 đã hoàn thành bảo dưỡng hệ thống an ninh.',
    date: '2024-12-07',
    type: 'Hoàn thành',
    severity: 'Thông báo',
    relatedApartment: 'H8',
    relatedBuilding: 'Tòa Nhà H',
    notes: 'Hệ thống an ninh hoạt động ổn định, đảm bảo an toàn.'
  },
  {
    id: 8,
    message: 'Cửa ra vào của căn hộ J10 sẽ được thay mới vào ngày 15/12/2024.',
    date: '2024-12-08',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'J10',
    relatedBuilding: 'Tòa Nhà J',
    notes: 'Cư dân vui lòng có mặt hoặc cung cấp chìa khóa dự phòng.'
  },
  {
    id: 9,
    message: 'Hệ thống chiếu sáng của căn hộ F6 đã được thay mới.',
    date: '2024-12-09',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'F6',
    relatedBuilding: 'Tòa Nhà F',
    notes: 'Hệ thống chiếu sáng LED tiết kiệm điện và thân thiện môi trường.'
  },
  {
    id: 10,
    message: 'Phòng tắm của căn hộ I9 sẽ được sửa chữa vào tuần tới.',
    date: '2024-12-10',
    type: 'Sửa chữa',
    severity: 'Thông báo',
    relatedApartment: 'I9',
    relatedBuilding: 'Tòa Nhà I',
    notes: 'Thời gian sửa chữa từ 8h - 16h, cư dân vui lòng sắp xếp thời gian.'
  },
  {
    id: 11,
    message: 'Hệ thống điện khẩn cấp tại tòa nhà K11 đang được kiểm tra.',
    date: '2024-12-11',
    type: 'Kiểm tra',
    severity: 'Cảnh báo',
    relatedBuilding: 'Tòa Nhà K',
    notes: 'Có thể xảy ra gián đoạn điện trong thời gian ngắn.'
  },
  {
    id: 12,
    message: 'Căn hộ L12 sẽ tiến hành bảo trì ống dẫn gas vào ngày 22/12/2024.',
    date: '2024-12-12',
    type: 'Bảo trì',
    severity: 'Cảnh báo',
    relatedApartment: 'L12',
    relatedBuilding: 'Tòa Nhà L',
    notes: 'Vui lòng không sử dụng bếp gas trong thời gian bảo trì.'
  },
  {
    id: 13,
    message: 'Hệ thống phòng cháy chữa cháy tại tòa nhà M13 sẽ được kiểm tra định kỳ.',
    date: '2024-12-13',
    type: 'Kiểm tra',
    severity: 'Cảnh báo',
    relatedBuilding: 'Tòa Nhà M',
    notes: 'Cư dân có thể nghe tiếng chuông báo động thử, không hoảng loạn.'
  },
  {
    id: 14,
    message: 'Cửa sổ căn hộ N14 bị nứt, sẽ thay thế vào tuần sau.',
    date: '2024-12-14',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'N14',
    relatedBuilding: 'Tòa Nhà N',
    notes: 'Cư dân cần di chuyển đồ đạc khỏi khu vực cửa sổ.'
  },
  {
    id: 15,
    message: 'Bồn rửa chén căn hộ O15 bị rò rỉ, sửa chữa vào ngày 18/12/2024.',
    date: '2024-12-15',
    type: 'Sửa chữa',
    severity: 'Cảnh báo',
    relatedApartment: 'O15',
    relatedBuilding: 'Tòa Nhà O',
    notes: 'Trong thời gian sửa, hạn chế sử dụng nước để tránh tràn.'
  },
  {
    id: 16,
    message: 'Thang máy tòa nhà P16 sẽ bảo trì lớn vào ngày 30/12/2024.',
    date: '2024-12-16',
    type: 'Bảo trì',
    severity: 'Khẩn cấp',
    relatedBuilding: 'Tòa Nhà P',
    notes: 'Thang máy ngừng hoạt động cả ngày, cư dân nên chuẩn bị.'
  },
  {
    id: 17,
    message: 'Căn hộ Q17 hoàn thành nâng cấp sàn gỗ.',
    date: '2024-12-17',
    type: 'Hoàn thành',
    severity: 'Thông báo',
    relatedApartment: 'Q17',
    relatedBuilding: 'Tòa Nhà Q',
    notes: 'Sàn gỗ mới giảm tiếng ồn và bền hơn.'
  },
  {
    id: 18,
    message: 'Tòa nhà R18 đang thay đường ống nước chính, có thể mất nước tạm thời.',
    date: '2024-12-18',
    type: 'Sửa chữa',
    severity: 'Cảnh báo',
    relatedBuilding: 'Tòa Nhà R',
    notes: 'Dự kiến mất nước từ 10h - 14h.'
  },
  {
    id: 19,
    message: 'Hệ thống quạt thông gió căn hộ S19 đang được kiểm tra.',
    date: '2024-12-19',
    type: 'Kiểm tra',
    severity: 'Thông báo',
    relatedApartment: 'S19',
    relatedBuilding: 'Tòa Nhà S',
    notes: 'Quá trình kiểm tra kéo dài 1 tiếng.'
  },
  {
    id: 20,
    message: 'Căn hộ T20 thay mới thiết bị khóa thông minh.',
    date: '2024-12-20',
    type: 'Thay mới',
    severity: 'Thông báo',
    relatedApartment: 'T20',
    relatedBuilding: 'Tòa Nhà T',
    notes: 'Cư dân cần đăng ký lại mã vào cửa.'
  },
];

export default notificationsData;

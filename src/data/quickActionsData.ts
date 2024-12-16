// src/data/quickActionsData.ts
interface QuickAction {
  id: number;
  title: string;
  action: string;
}

const quickActionsData: QuickAction[] = [
  { id: 1, title: 'Thanh toán tiền thuê', action: '/payment' },
  { id: 2, title: 'Yêu cầu sửa chữa', action: '/repair' },
  { id: 3, title: 'Kiểm tra lịch sử cư trú', action: '/residence-history' },
  { id: 4, title: 'Đổi mật khẩu', action: '/change-password' },
  { id: 5, title: 'Cập nhật thông tin cá nhân', action: '/update-info' },
];

export default quickActionsData;

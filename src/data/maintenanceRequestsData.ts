export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
  requestDate: string;
  location: string;
  assignedTo?: string;
  completionDate?: string;
  notes?: string;
}

export const sampleRequests: MaintenanceRequest[] = [
  {
    id: 1,
    title: 'Sửa chữa điều hòa',
    description: 'Điều hòa phòng 301 không làm lạnh',
    status: 'pending',
    priority: 'high',
    requestedBy: 'Nguyễn Văn A',
    requestDate: '2024-12-15',
    location: 'Phòng 301',
  },
  {
    id: 2,
    title: 'Thay bóng đèn',
    description: 'Bóng đèn hành lang tầng 2 bị cháy',
    status: 'in-progress',
    priority: 'medium',
    requestedBy: 'Trần Thị B',
    requestDate: '2024-12-14',
    location: 'Hành lang tầng 2',
    assignedTo: 'Kỹ thuật viên C',
  },
  {
    id: 3,
    title: 'Sửa khóa cửa',
    description: 'Khóa cửa phòng 205 bị kẹt',
    status: 'completed',
    priority: 'high',
    requestedBy: 'Lê Văn D',
    requestDate: '2024-12-13',
    location: 'Phòng 205',
    assignedTo: 'Kỹ thuật viên E',
    completionDate: '2024-12-14',
    notes: 'Đã thay thế ổ khóa mới',
  },
];

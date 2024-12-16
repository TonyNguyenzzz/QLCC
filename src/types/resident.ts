export enum ResidentStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export interface Resident {
  id: number;
  name: string;
  email: string;
  phone: string;
  apartmentNumber: string;
  buildingName: string;
  status: ResidentStatus;
  moveInDate: string;
  rentAmount: number;
  occupation: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface ResidentValidation {
  validate(resident: Resident): string[];
}

export class ResidentValidator implements ResidentValidation {
  validate(resident: Resident): string[] {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!resident.name || resident.name.trim().length < 2) {
      errors.push('Tên cư dân không hợp lệ');
    }

    if (!emailRegex.test(resident.email)) {
      errors.push('Địa chỉ email không hợp lệ');
    }

    if (!phoneRegex.test(resident.phone)) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (resident.rentAmount <= 0) {
      errors.push('Tiền thuê phải lớn hơn 0');
    }

    if (!resident.emergencyContact.name || !resident.emergencyContact.phone) {
      errors.push('Thông tin liên hệ khẩn cấp không đầy đủ');
    }

    return errors;
  }
}

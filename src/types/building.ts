export enum BuildingStatus {
  Active = 'active',
  Maintenance = 'maintenance',
  Renovation = 'renovation'
}

export interface Building {
  id: number;
  name: string;
  address: string;
  totalFloors: number;
  totalUnits: number;
  occupiedUnits: number;
  maintenanceRequests: number;
  amenities: string[];
  status: BuildingStatus;
  image?: string;
  description: string;
  yearBuilt: string;
  lastRenovation?: string;
  parkingSpaces: number;
  monthlyRevenue: number;
}

export interface BuildingValidation {
  validate(building: Building): string[];
}

export class BuildingValidator implements BuildingValidation {
  validate(building: Building): string[] {
    const errors: string[] = [];

    if (!building.name || building.name.trim().length < 3) {
      errors.push('Tên tòa nhà phải có ít nhất 3 ký tự');
    }

    if (!building.address || building.address.trim().length < 5) {
      errors.push('Địa chỉ không hợp lệ');
    }

    if (building.totalFloors <= 0) {
      errors.push('Số tầng phải lớn hơn 0');
    }

    if (building.totalUnits < building.occupiedUnits) {
      errors.push('Số đơn vị đã thuê không được vượt quá tổng số đơn vị');
    }

    if (building.monthlyRevenue < 0) {
      errors.push('Doanh thu hàng tháng không được âm');
    }

    return errors;
  }
}

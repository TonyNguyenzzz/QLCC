export interface Resident {
  id: string;
  name: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface ResidencyHistory {
  id: string;
  residentId: string;
  resident: Resident;
  buildingId: string;
  apartmentId: string;
  startDate: Date;
  endDate?: Date;
  leaseType: 'rent' | 'own';
  monthlyRent?: number;
  depositAmount?: number;
  contractNumber: string;
  status: 'active' | 'terminated' | 'expired';
  terminationReason?: string;
  notes?: string;
  documents?: {
    type: 'contract' | 'identity' | 'other';
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
  utilities: {
    type: 'electricity' | 'water' | 'internet' | 'parking' | 'other';
    included: boolean;
    monthlyFee?: number;
  }[];
  occupants: {
    name: string;
    relationship: string;
    identityNumber?: string;
    phoneNumber?: string;
  }[];
  violations?: {
    date: Date;
    type: string;
    description: string;
    status: 'pending' | 'resolved';
    resolution?: string;
  }[];
  maintenanceRequests?: {
    date: Date;
    type: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedDate?: Date;
    cost?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

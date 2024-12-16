export enum PaymentType {
  Rent = 'rent',
  Maintenance = 'maintenance', 
  Utility = 'utility',
  Other = 'other'
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Overdue = 'overdue',
  Cancelled = 'cancelled'
}

export enum PaymentMethod {
  Cash = 'cash',
  BankTransfer = 'bank_transfer',
  CreditCard = 'credit_card'
}

export interface Payment {
  id: number;
  residentName: string;
  apartmentId: string;
  buildingId: string;
  amount: number;
  type: PaymentType;
  dueDate: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  description?: string;
  paidDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentValidation {
  validate(payment: Payment): string[];
}

export class PaymentValidator implements PaymentValidation {
  validate(payment: Payment): string[] {
    const errors: string[] = [];

    if (payment.amount <= 0) {
      errors.push('Số tiền thanh toán phải lớn hơn 0');
    }

    if (payment.dueDate < new Date()) {
      if (payment.status !== PaymentStatus.Overdue) {
        errors.push('Thanh toán đã quá hạn');
      }
    }

    if (!payment.residentName || payment.residentName.trim().length < 2) {
      errors.push('Tên người thanh toán không hợp lệ');
    }

    return errors;
  }
}

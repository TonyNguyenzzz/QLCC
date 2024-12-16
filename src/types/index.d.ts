// src/types/index.d.ts
export interface User {
    email: string;
    name: string;
  }
  
  export interface Apartment {
    id: number;
    number: string;
    status: string;
    history: string;
  }
  
  export interface Building {
    id: number;
    name: string;
    address: string;
    floors: number;
  }
  
  export interface Payment {
    id: number;
    resident: string;
    amount: number;
    date: string;
  }
  
  export interface ResidenceRecord {
    id: number;
    resident: string;
    apartment: string;
    moveIn: string;
    moveOut: string;
  }
  
  export interface Repair {
    id: number;
    apartment: string;
    description: string;
    status: string;
  }
  
  export interface MonthlyRevenue {
    month: string;
    amount: number;
  }
  
  export interface StatusData {
    name: string;
    value: number;
  }
  
  export interface ReportsData {
    monthlyRevenue: MonthlyRevenue[];
    apartmentStatus: StatusData[];
    repairsStatus: StatusData[];
  }
  
  export interface Notification {
    id: number;
    message: string;
    date: string;
  }
  
  export interface QuickAction {
    id: number;
    name: string;
    icon: string;
    route: string;
  }
  
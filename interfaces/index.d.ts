export interface ActivePromotion {
    isActive: boolean;
    promotionDuration: number;
  }
  
  export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    currency: string;
    hostId: string;
    memberId: string;
    passwordRepeat: string;
    agent?: string;
    balance?: number | null;
    promotionalBalance?: number | null;
    activePromotion?: ActivePromotion;
    bank: string;
    bankAccountName: string;
    bankAccountNumber: string;
    phoneNumber: string;
    lastPromotionClaim?: Date | null;
  }
export interface Restaurant {
  id: string;
  name: string;
  emoji?: string;
  image: string;
  rating: number;
  distance: number;
  deliveryTime: number;
  tags: string[];
  priceRange: string;
  isClosed?: boolean;
  closingTime?: string;
  discount?: {
    type: string;
    value: string;
    menuValue?: string;
  };
  preferred?: boolean;
  outlets?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Deal {
  id: string;
  title: string;
  image: string;
  discount: string;
  originalPrice?: string;
  price?: string;
  type: 'DISCOUNT' | 'FREESHIP' | 'SPECIAL';
}

export interface FlashSaleItem {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice: string;
  discount: string;
  sellingFast?: boolean;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  link: string;
}

export interface RecentVisit {
  id: string;
  name: string;
  image: string;
  visitedDaysAgo: number;
  isClosed?: boolean;
  reopenDate?: string;
  discount?: {
    type: string;
    value: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: {
    id: string;
    name: string;
    price?: number;
  }[];
  required?: boolean;
  multiple?: boolean;
}

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
  options?: {
    name: string;
    id: string;
    choices: {
      id: string;
      name: string;
      price?: number;
    }[];
  }[];
}

export interface UserLocation {
  id?: string;
  label?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  password?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  isLimited: boolean;
  usageLimit?: number;
  usageCount?: number;
  category: 'RESTAURANT' | 'SHIPPING' | 'PLATFORM' | 'PARTNER';
  iconColor: string;
  icon: string;
  isAvailable: boolean;
  unavailableReason?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  isAvailable: boolean;
}

export interface TipOption {
  id: string;
  value: number;
  label: string;
}

export interface CheckoutPreferences {
  selectedVoucher?: Voucher | null;
  tipAmount: number;
  deliveryOption: string;
  includeCutlery: boolean;
  note: string;
  selectedPaymentMethod: string;
  selectedAddress: UserLocation;
}
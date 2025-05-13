import { Restaurant, Category, Deal, FlashSaleItem, Banner, RecentVisit, Voucher, DeliveryOption, TipOption, UserLocation, Order } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Hot Deal Today',
    icon: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '2',
    name: 'Freeship',
    icon: 'https://images.unsplash.com/photo-1586999528871-ded77bc9656c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRlbGl2ZXJ5fGVufDB8fDB8fHww',
  },
  {
    id: '3',
    name: 'Mart Miễn Phí Ship',
    icon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '4',
    name: 'Ăn Khuya Freeship 2k',
    icon: 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5pZ2h0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '5',
    name: '50% Off',
    icon: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '6',
    name: 'Combo 129k + Voucher 99k',
    icon: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tYm98ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '7',
    name: 'Deal 0Đ',
    icon: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '8',
    name: 'Quán Tiện Bột',
    icon: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D',
  },
];

export const deals: Deal[] = [
  {
    id: '1',
    title: 'Deal Ngon Chào Hè, Giảm 55.000Đ',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww',
    discount: '55.000Đ',
    type: 'DISCOUNT',
  },
  {
    id: '2',
    title: 'Vạn Món Giá Hời Giảm 50.000Đ',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2R8ZW58MHx8MHx8fDA%3D',
    discount: '50.000Đ',
    type: 'DISCOUNT',
  },
  {
    id: '3',
    title: 'Ngày Hè Sôi Động, Freeship 0Đ',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    discount: '0Đ',
    type: 'FREESHIP',
  },
];

export const flashSaleItems: FlashSaleItem[] = [
  {
    id: '1',
    name: 'Đậu phộng kho',
    image: 'https://images.unsplash.com/photo-1591300589766-8da35f8d5efa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVhbnV0c3xlbnwwfHwwfHx8MA%3D%3D',
    price: '9.000đ',
    originalPrice: '18.000đ',
    discount: '50% OFF',
    sellingFast: true,
  },
  {
    id: '2',
    name: 'Mít Thái - 300gr',
    image: 'https://images.unsplash.com/photo-1622606998653-da0b6c2c5f97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFja2ZydWl0fGVufDB8fDB8fHww',
    price: '12.500đ',
    originalPrice: '25.000đ',
    discount: '50% OFF',
    sellingFast: true,
  },
  {
    id: '3',
    name: 'BÁNH MÌ BƠ & PATE',
    image: 'https://images.unsplash.com/photo-1600458296525-57abf1ee1210?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJyZWFkfGVufDB8fDB8fHww',
    price: '27.000đ',
    originalPrice: '54.000đ',
    discount: '50% OFF',
    sellingFast: true,
  },
  {
    id: '4',
    name: 'CHÁ GIÒ',
    image: 'https://images.unsplash.com/photo-1625938144207-a38a363c4fb6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3ByaW5nJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D',
    price: '1.000đ',
    originalPrice: '2.000đ',
    discount: '50% OFF',
    sellingFast: true,
  },
];

export const banners: Banner[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    title: 'ĂN THẢ GA GIẢM KHÔNG GIỚI HẠN',
    link: '/promotions/1',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnViYmxlJTIwdGVhfGVufDB8fDB8fHww',
    title: 'MAYCHA KHẢO MÓN 9.000Đ + VOUCHER 53.000Đ',
    link: '/promotions/2',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emF8ZW58MHx8MHx8fDA%3D',
    title: 'SIÊU TIỆC CHÀO HÈ 99.000 ĐỒNG',
    link: '/promotions/3',
  },
];

export const recentVisits: RecentVisit[] = [
  {
    id: '1',
    name: 'Hồng Trà Ngô Gia - Đường 30/4',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
    visitedDaysAgo: 4,
    discount: {
      type: 'CODE',
      value: '11% off',
    },
  },
  {
    id: '2',
    name: 'Gà Rán Và Mì Ý - Jollibee',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZWQlMjBjaGlja2VufGVufDB8fDB8fHww',
    visitedDaysAgo: 6,
    isClosed: true,
    reopenDate: '27/04',
    discount: {
      type: 'CODE',
      value: '10% off',
    },
  },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    emoji: '🍞',
    name: 'Bánh Tráng Thảo Mèo - Ăn Vặt - Nguyễn Văn Cừ Nối Dài',
    image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RyZWV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.8,
    distance: 0.6,
    deliveryTime: 25,
    tags: ['Street Food', 'Snacks'],
    priceRange: '$',
    preferred: true,
    discount: {
      type: 'MENU',
      value: 'Code 90.000đ off',
      menuValue: '1% off menu',
    },
    outlets: 2,
    address: '192D đường 30/4, P. An Phú, Quận Ninh Kiều, Cần Thơ',
  },
  {
    id: '2',
    emoji: '🥪',
    name: 'TIỆM BÁNH CANH - ANH BA CHỈ - CHI NHÁNH 2 NGUYỄN VĂN CỪ NỐI DÀI',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlldG5hbWVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D',
    rating: 4.8,
    distance: 1.4,
    deliveryTime: 30,
    tags: ['Vietnamese', 'Noodles'],
    priceRange: '$$',
    preferred: true,
    discount: {
      type: 'CODE',
      value: 'Code 11% off',
    },
    address: 'Số 401 Đường Nguyễn Văn Cừ, P. An Hòa, Quận Ninh Kiều, Cần Thơ',
  },
  {
    id: '3',
    emoji: '🍗',
    name: 'Cơm Gà Kim - Nguyễn Văn Cừ',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2tlbiUyMHJpY2V8ZW58MHx8MHx8fDA%3D',
    rating: 4.6,
    distance: 2.9,
    deliveryTime: 30,
    tags: ['Rice', 'Chicken'],
    priceRange: '$$',
    preferred: true,
    discount: {
      type: 'CODE',
      value: 'Code 15.000đ off',
    },
    address: '123 Nguyễn Văn Cừ, P. An Khánh, Quận Ninh Kiều, Cần Thơ',
  },
  {
    id: '4',
    emoji: '🍵',
    name: 'Hồng Trà Ngô Gia - Đường 30/4',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.9,
    distance: 3.0,
    deliveryTime: 27,
    tags: ['Milk Tea', 'Drinks'],
    priceRange: '$$',
    preferred: true,
    isClosed: true,
    closingTime: '22:45',
    discount: {
      type: 'CODE',
      value: 'Code 11% off',
    },
    outlets: 14,
    address: '160B Đường 3 Tháng 2, P. Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
  },
  {
    id: '5',
    emoji: '🍵',
    name: 'Trà Sữa Maycha - 15C Mậu Thân',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnViYmxlJTIwdGVhfGVufDB8fDB8fHww',
    rating: 4.8,
    distance: 2.9,
    deliveryTime: 27,
    tags: ['Bubble Tea', 'Drinks'],
    priceRange: '$$',
    preferred: true,
    isClosed: true,
    closingTime: '22:30',
    discount: {
      type: 'CODE',
      value: 'Code 10% off',
    },
    outlets: 1,
    address: '15C Mậu Thân, P. Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
  },
];

export const defaultLocation: string = '384/B1 Đ. Trần Nam Phú, Phường An Khánh, Ninh Kiều, Cần Thơ';

export const savedAddresses: UserLocation[] = [
  {
    id: '1',
    label: 'Home',
    address: '384/B1 Đ. Trần Nam Phú, Phường An Khánh, Ninh Kiều, Cần Thơ',
    latitude: 10.0341,
    longitude: 105.7882,
    isDefault: true
  },
  {
    id: '2',
    label: 'Work',
    address: '30 Nguyễn Văn Cừ, Phường An Hòa, Ninh Kiều, Cần Thơ',
    latitude: 10.0312,
    longitude: 105.7702,
    isDefault: false
  },
  {
    id: '3',
    label: 'Gym',
    address: '15 Đ. 3/2, Phường Xuân Khánh, Ninh Kiều, Cần Thơ',
    latitude: 10.0298,
    longitude: 105.7689,
    isDefault: false
  },
];

export const vouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME15',
    title: 'Code 15% off, cap 10.000đ min order 45.000đ',
    description: 'Get 15% off on your order',
    discountType: 'PERCENT',
    discountValue: 15,
    minOrderValue: 45000,
    maxDiscount: 10000,
    expiryDate: '31.05.2025',
    isLimited: true,
    usageLimit: 5,
    usageCount: 0,
    category: 'PARTNER',
    iconColor: '#FF5733',
    icon: 'ticket',
    isAvailable: true
  },
  {
    id: '2',
    code: 'FREESHIP50',
    title: 'Code 50% off on shipping fee, cap 20.000đ',
    description: 'Get 50% off on shipping fee',
    discountType: 'SHIPPING',
    discountValue: 50,
    minOrderValue: 0,
    maxDiscount: 20000,
    expiryDate: '31.05.2025',
    isLimited: true,
    category: 'SHIPPING',
    iconColor: '#20B2AA',
    icon: 'truck',
    isAvailable: true
  },
  {
    id: '3',
    code: 'FREESHIP60',
    title: 'Code 50% off on shipping fee, min order 60.000đ',
    description: 'Get 50% off on shipping fee',
    discountType: 'SHIPPING',
    discountValue: 50,
    minOrderValue: 60000,
    maxDiscount: 20000,
    expiryDate: '31.05.2025',
    isLimited: true,
    usageLimit: 5,
    usageCount: 0,
    category: 'SHIPPING',
    iconColor: '#20B2AA',
    icon: 'truck',
    isAvailable: true
  },
  {
    id: '4',
    code: 'SHINHAN50K',
    title: 'Shinhan Finance 50.000đ off on total dish',
    description: 'Get 50.000đ off on your total order',
    discountType: 'FIXED',
    discountValue: 50000,
    minOrderValue: 100000,
    expiryDate: '30.06.2025',
    isLimited: false,
    category: 'PLATFORM',
    iconColor: '#4169E1',
    icon: 'credit-card',
    isAvailable: false,
    unavailableReason: 'Min spend does not reach'
  }
];

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Delivery within 30-45 minutes',
    price: 15000,
    estimatedTime: '30-45 min',
    isAvailable: true
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Delivery within 15-25 minutes',
    price: 25000,
    estimatedTime: '15-25 min',
    isAvailable: true
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    description: 'Choose your delivery time',
    price: 15000,
    estimatedTime: 'You choose',
    isAvailable: true
  }
];

export const tipOptions: TipOption[] = [
  {
    id: 'none',
    value: 0,
    label: 'None'
  },
  {
    id: '5k',
    value: 5000,
    label: '5K'
  },
  {
    id: '10k',
    value: 10000,
    label: '10K'
  },
  {
    id: '15k',
    value: 15000,
    label: '15K'
  },
  {
    id: 'other',
    value: 0,
    label: 'Other'
  }
];

export const orders: Order[] = [
  {
    id: '09094-767258805',
    user: {
      id: 'hungthinhh2003',
      name: 'hungthinhh2003',
      phoneNumber: '0944034769',
      createdAt: new Date('2023-01-15'),
      isGroupLeader: true
    },
    restaurant: {
      id: '4',
      name: 'Trà Sữa DUFANG - Đường 3 Tháng 2',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
      address: '160B Đường 3 Tháng 2, P. Xuân Khánh, Quận Ninh Kiều, Cần Thơ'
    },
    items: [
      {
        id: '1',
        name: 'Hồng trà đen',
        price: 1000,
        originalPrice: 20000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
        isFlashSale: true
      }
    ],
    deliveryAddress: {
      address: '384/B1 Đ. Trần Nam Phú, Phường An Khánh, Ninh Kiều, Cần Thơ 900000, Việt Nam',
      contactName: 'Nguyễn Hùng Thịnh',
      contactPhone: '0944034769'
    },
    deliveryDistance: 1.8,
    deliveryFee: 15000,
    platformFee: 6000,
    subtotal: 1000,
    discount: 15000,
    total: 7000,
    status: 'COMPLETED',
    paymentMethod: 'ShopeePay',
    paymentStatus: 'PAID',
    orderTime: '21:18 09/09/2024',
    includeCutlery: true,
    canRate: true,
    isRated: false
  },
  {
    id: '04044-750574520',
    user: {
      id: 'hungthinhh2003',
      name: 'hungthinhh2003',
      phoneNumber: '0944034769',
      createdAt: new Date('2023-01-15'),
      isGroupLeader: true
    },
    restaurant: {
      id: '1',
      name: 'Ăn Vặt Nhà Thu - Chân Gà Sốt Thái, Cá Viên Chiên',
      image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RyZWV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      address: '123 Đường 30/4, P. Hưng Lợi, Quận Ninh Kiều, Cần Thơ'
    },
    items: [
      {
        id: '1',
        name: 'Trà Chanh Giải Tay Truyền Thống',
        price: 9000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVtb24lMjB0ZWF8ZW58MHx8MHx8fDA%3D'
      }
    ],
    deliveryAddress: {
      address: '384/B1 Đ. Trần Nam Phú, Phường An Khánh, Ninh Kiều, Cần Thơ 900000, Việt Nam',
      contactName: 'Nguyễn Hùng Thịnh',
      contactPhone: '0944034769'
    },
    deliveryDistance: 2.5,
    deliveryFee: 18000,
    platformFee: 3000,
    subtotal: 9000,
    discount: 0,
    total: 30000,
    status: 'COMPLETED',
    paymentMethod: 'Cash',
    paymentStatus: 'PAID',
    orderTime: '19:45 04/04/2024',
    includeCutlery: false,
    canRate: true,
    isRated: true
  }
];
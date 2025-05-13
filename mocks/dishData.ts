export const mockDishes = [
    {
      id: '1',
      name: 'Hồng Trà Bí Đao',
      description: 'Bổ dưỡng cơ định, không chia độ đường',
      price: 19000,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '3.7k',
      likeCount: 26,
      category: 'Drinks',
      popular: true,
    },
    {
      id: '2',
      name: 'Trà Xanh Ô Mai Chanh Dây',
      description: 'Trà xanh thơm mát kết hợp với ô mai và chanh dây chua ngọt',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1556679343-c1c1c9308e4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVhY2glMjB0ZWF8ZW58MHx8MHx8fDA%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '2.5k',
      likeCount: 18,
      category: 'Drinks',
      popular: false,
    },
    {
      id: '3',
      name: 'Hồng Trà Đài Loan',
      description: 'Hồng trà thơm ngon đậm đà phong cách Đài Loan',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '1.9k',
      likeCount: 15,
      category: 'Drinks',
      popular: true,
    },
    {
      id: '4',
      name: 'Bát Bảo Ngô Gia (Ngọt)',
      description: 'Hạt É, Trân Châu Đường Đen, Ít đá, 30%',
      price: 36000,
      image: 'https://images.unsplash.com/photo-1558857563-c0c6ee6ff6e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1YmJsZSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '4.2k',
      likeCount: 32,
      category: 'Drinks',
      popular: true,
    },
    {
      id: '5',
      name: 'Hồng Trà Chanh Đài Loan',
      description: 'Size L, Nhiều đá, 100%',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVtb24lMjB0ZWF8ZW58MHx8MHx8fDA%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '3.1k',
      likeCount: 24,
      category: 'Drinks',
      popular: true,
    },
    {
      id: '6',
      name: 'Trà Xanh Chanh',
      description: 'Trà xanh thơm mát kết hợp với chanh tươi',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1556679343-c1c1c9308e4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVhY2glMjB0ZWF8ZW58MHx8MHx8fDA%3D',
      restaurantId: '4',
      restaurantName: 'Hồng Trà Ngô Gia - Đường 30/4',
      orderCount: '2.8k',
      likeCount: 21,
      category: 'Drinks',
      popular: false,
    },
  ];
  
  export const mockReviews = [
    {
      id: '1',
      dishId: '1',
      userName: 'ngọc vy',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
      rating: 5,
      text: 'lịch sự',
      date: '2025-04-25T09:42:00',
      recommendedDishes: [
        {
          id: '2',
          name: 'Trà Xanh Ô Mai Chanh Dây'
        },
        {
          id: '3',
          name: 'Hồng Trà Đài Loan'
        }
      ]
    },
    {
      id: '2',
      dishId: '1',
      userName: 'Như Quỳnh',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
      rating: 4,
      text: 'Trà ngon, thơm, uống rất đã. Sẽ ủng hộ tiếp.',
      date: '2025-04-23T14:15:00',
      recommendedDishes: []
    },
    {
      id: '3',
      dishId: '1',
      userName: 'Minh Tuấn',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      rating: 5,
      text: 'Đồ uống rất ngon, giao hàng nhanh. Sẽ quay lại lần sau.',
      date: '2025-04-20T18:30:00',
      recommendedDishes: [
        {
          id: '5',
          name: 'Hồng Trà Chanh Đài Loan'
        }
      ]
    },
    {
      id: '4',
      dishId: '4',
      userName: 'Thanh Hà',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      rating: 5,
      text: 'Món này rất ngon, trân châu dẻo, vị ngọt vừa phải.',
      date: '2025-04-22T10:15:00',
      recommendedDishes: []
    },
    {
      id: '5',
      dishId: '5',
      userName: 'Hoàng Nam',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      rating: 4,
      text: 'Chanh tươi, vị chua ngọt hài hòa. Sẽ mua lại.',
      date: '2025-04-21T16:45:00',
      recommendedDishes: []
    }
  ];
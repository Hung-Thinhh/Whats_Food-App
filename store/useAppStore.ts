import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, UserLocation, MenuItem } from '@/types';
import { defaultLocation } from '@/mocks/data';

interface AppState {
  userLocation: UserLocation;
  cart: CartItem[];
  favorites: string[];
  recentSearches: string[];
  
  // User location
  setUserLocation: (location: UserLocation) => void;
  
  // Cart operations
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getRestaurantFromCart: () => string | null;
  
  // Favorites
  toggleFavorite: (restaurantId: string) => void;
  
  // Search history
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userLocation: { address: defaultLocation },
      cart: [],
      favorites: [],
      recentSearches: [],
      
      setUserLocation: (location) => set({ userLocation: location }),
      
      addToCart: (item) => set((state) => {
        // Check if we already have items from a different restaurant
        const existingRestaurantId = state.cart.length > 0 ? state.cart[0].restaurantId : null;
        
        if (existingRestaurantId && existingRestaurantId !== item.restaurantId) {
          // Replace cart with new restaurant items
          return { cart: [item] };
        }
        
        // Check if item already exists in cart
        const existingItemIndex = state.cart.findIndex(
          (cartItem) => cartItem.id === item.id
        );
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...state.cart];
          updatedCart[existingItemIndex].quantity += item.quantity;
          return { cart: updatedCart };
        }
        
        return { cart: [...state.cart, item] };
      }),
      
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== itemId)
      })),
      
      updateCartItemQuantity: (itemId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            cart: state.cart.filter((item) => item.id !== itemId)
          };
        }
        
        const updatedCart = state.cart.map((item) => 
          item.id === itemId ? { ...item, quantity } : item
        );
        return { cart: updatedCart };
      }),
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const optionsTotal = item.options ? 
            item.options.reduce((sum, option) => sum + (option.price || 0), 0) * item.quantity : 0;
          return total + itemTotal + optionsTotal;
        }, 0);
      },
      
      getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      getRestaurantFromCart: () => {
        const { cart } = get();
        return cart.length > 0 ? cart[0].restaurantId : null;
      },
      
      toggleFavorite: (restaurantId) => set((state) => {
        if (state.favorites.includes(restaurantId)) {
          return { 
            favorites: state.favorites.filter((id) => id !== restaurantId) 
          };
        } else {
          return { 
            favorites: [...state.favorites, restaurantId] 
          };
        }
      }),
      
      addRecentSearch: (search) => set((state) => {
        const filteredSearches = state.recentSearches.filter(
          (item) => item !== search
        );
        return { 
          recentSearches: [search, ...filteredSearches].slice(0, 10) 
        };
      }),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'food-delivery-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
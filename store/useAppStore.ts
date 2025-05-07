import { singleCartSchema } from './../schema/cart.schema';
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, UserLocation, MenuItem,Voucher, CheckoutPreferences, TipOption } from "@/types";
import { defaultLocation } from "@/mocks/data";
import { AddCartBodyType } from "@/schema/cart.schema";
import CartApiRequest from "@/api/cart.api";
import { getAccessToken } from "@/storange/auth.storage";

interface AppState {
  userLocation: UserLocation;
  savedAddresses: UserLocation[];
  cart: typeof singleCartSchema[];
  favorites: string[];
  recentSearches: string[];
  checkoutPreferences: CheckoutPreferences;

 // User location
 setUserLocation: (location: UserLocation) => void;
 getSavedAddresses: () => UserLocation[];
 addSavedAddress: (address: UserLocation) => void;
 removeSavedAddress: (addressId: string) => void;
 setDefaultAddress: (addressId: string) => void;

  // Cart operations
  addToCart: (item: AddCartBodyType) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number, option: string) => void;
  clearCart: () => void;
  getCartToServer:()=> void;
  getCartTotal: () => number;
  getCartItemCount: (id:string) => number;
  getRestaurantFromCart: () => string | null;

   // Checkout preferences
   setSelectedVoucher: (voucher: Voucher | null) => void;
   setTipAmount: (amount: number) => void;
   setDeliveryOption: (optionId: string) => void;
   setIncludeCutlery: (include: boolean) => void;
   setNote: (note: string) => void;
   setSelectedPaymentMethod: (method: string) => void;
   setSelectedAddress: (address: UserLocation) => void;
   getAvailableVouchers: () => Voucher[];
   getUnavailableVouchers: () => Voucher[];
   getAppliedDiscount: () => number;
  
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
      savedAddresses: savedAddresses,
      cart: [],
      favorites: [],
      recentSearches: [],
      checkoutPreferences: {
        selectedVoucher: null,
        tipAmount: 0,
        deliveryOption: 'standard',
        includeCutlery: false,
        note: '',
        selectedPaymentMethod: 'cash',
        selectedAddress: savedAddresses[0]
      },
      setUserLocation: (location) => set({ userLocation: location }),
      getSavedAddresses: () => {
        return get().savedAddresses;
      },
      
      addSavedAddress: (address) => set((state) => {
        const newAddress = {
          ...address,
          id: Date.now().toString(),
          isDefault: state.savedAddresses.length === 0
        };
        return { savedAddresses: [...state.savedAddresses, newAddress] };
      }),
      
      removeSavedAddress: (addressId) => set((state) => {
        const updatedAddresses = state.savedAddresses.filter(addr => addr.id !== addressId);
        
        // If we removed the default address, set a new default
        if (state.savedAddresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }
        
        return { savedAddresses: updatedAddresses };
      }),
      
      setDefaultAddress: (addressId) => set((state) => {
        const updatedAddresses = state.savedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }));
        
        return { savedAddresses: updatedAddresses };
      }),
      getCartToServer: async () => {
        const token = await getAccessToken();
        const req = await CartApiRequest.get(token);
        console.log("get cart:", req.payload);

        if (req.payload.EC !== "0") {
          return false;
        }
        set({ cart: req.payload.DT });
      },
      addToCart: async (item) => {
        const token = await getAccessToken();
        const req = await CartApiRequest.add(item,token);
        console.log("add cart:", req.payload);

        if (req.payload.EC !== "0") {
          return false;
        }
        set({ cart: req.payload.DT });
      },

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),

      updateCartItemQuantity: async(itemId, quantity, option) =>{
        console.log("tăng nè:", itemId, quantity, option);
        
        const token = await getAccessToken();
        const req = await CartApiRequest.quantity(itemId,quantity,option,token);
        console.log("tăng nè:", req.payload);

        if (req.payload.EC !== "0") {
          return false;
        }
        set({ cart: req.payload.DT });
      },
        
      

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const optionsTotal = item.options
            ? item.options.reduce(
                (sum, option) => sum + (option.price || 0),
                0
              ) * item.quantity
            : 0;
          return total + itemTotal + optionsTotal;
        }, 0);
      },

      getCartItemCount: (id:string) => {
        const { cart } = get();
        
        const matchedCart = cart.find((c) => c.restaurantId === id);
        console.log("cart:", matchedCart);
        return  matchedCart
      },

      getRestaurantFromCart: () => {
        const { cart } = get();
        return cart.length > 0 ? cart[0].restaurantId : null;
      },

      setSelectedVoucher: (voucher) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          selectedVoucher: voucher
        }
      })),
      
      setTipAmount: (amount) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          tipAmount: amount
        }
      })),
      
      setDeliveryOption: (optionId) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          deliveryOption: optionId
        }
      })),
      
      setIncludeCutlery: (include) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          includeCutlery: include
        }
      })),
      
      setNote: (note) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          note: note
        }
      })),
      
      setSelectedPaymentMethod: (method) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          selectedPaymentMethod: method
        }
      })),
      
      setSelectedAddress: (address) => set((state) => ({
        checkoutPreferences: {
          ...state.checkoutPreferences,
          selectedAddress: address
        }
      })),
      
      getAvailableVouchers: () => {
        const { cart } = get();
        const subtotal = get().getCartTotal();
        
        return vouchers.filter(voucher => {
          // Check if voucher is available
          if (!voucher.isAvailable) return false;
          
          // Check minimum order value
          if (subtotal < voucher.minOrderValue) return false;
          
          return true;
        });
      },
      
      getUnavailableVouchers: () => {
        const { cart } = get();
        const subtotal = get().getCartTotal();
        
        return vouchers.filter(voucher => {
          // Already unavailable
          if (!voucher.isAvailable) return true;
          
          // Check minimum order value
          if (subtotal < voucher.minOrderValue) {
            voucher.unavailableReason = 'Min spend does not reach';
            return true;
          }
          
          return false;
        });
      },
      
      getAppliedDiscount: () => {
        const { checkoutPreferences } = get();
        const { selectedVoucher } = checkoutPreferences;
        const subtotal = get().getCartTotal();
        
        if (!selectedVoucher) return 0;
        
        let discount = 0;
        
        switch (selectedVoucher.discountType) {
          case 'PERCENT':
            discount = subtotal * (selectedVoucher.discountValue / 100);
            // Apply max discount cap if exists
            if (selectedVoucher.maxDiscount && discount > selectedVoucher.maxDiscount) {
              discount = selectedVoucher.maxDiscount;
            }
            break;
            
          case 'FIXED':
            discount = selectedVoucher.discountValue;
            break;
            
          case 'SHIPPING':
            // Find the selected delivery option price
            const deliveryOption = deliveryOptions.find(
              option => option.id === checkoutPreferences.deliveryOption
            );
            if (deliveryOption) {
              discount = deliveryOption.price * (selectedVoucher.discountValue / 100);
              // Apply max discount cap if exists
              if (selectedVoucher.maxDiscount && discount > selectedVoucher.maxDiscount) {
                discount = selectedVoucher.maxDiscount;
              }
            }
            break;
        }
        
        return discount;
      },
      toggleFavorite: (restaurantId) =>
        set((state) => {
          if (state.favorites.includes(restaurantId)) {
            return {
              favorites: state.favorites.filter((id) => id !== restaurantId),
            };
          } else {
            return {
              favorites: [...state.favorites, restaurantId],
            };
          }
        }),

      addRecentSearch: (search) =>
        set((state) => {
          const filteredSearches = state.recentSearches.filter(
            (item) => item !== search
          );
          return {
            recentSearches: [search, ...filteredSearches].slice(0, 10),
          };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "food-delivery-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

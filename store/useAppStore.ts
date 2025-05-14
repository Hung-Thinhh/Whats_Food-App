import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CartItem,
  UserLocation,
  MenuItem,
  Voucher,
  CheckoutPreferences,
  TipOption,
  Order,
} from "@/types";
import {
  defaultLocation,
  savedAddresses,
  vouchers,
  deliveryOptions,
  tipOptions,
  orders,
} from "@/mocks/data";
import { singleCartSchema } from "@/schema/cart.schema";
import { AddCartBodyType } from "@/schema/cart.schema";
import CartApiRequest from "@/api/cart.api";
import { getAccessToken } from "@/storange/auth.storage";
import addressApiRequest from "@/api/address.api";

interface AppState {
  userLocation: UserLocation;
  newLocation: UserLocation;
  savedAddresses: UserLocation[];
  cart: (typeof singleCartSchema)[];
  favorites: string[];
  recentSearches: string[];
  checkoutPreferences: CheckoutPreferences;
  orders: Order[];
  isAuthenticated: boolean;

  // User location
  setUserLocation: (location: UserLocation) => void;
  setNewLocation: (location: UserLocation) => void;
  getSavedAddresses: () => Promise<void>;
  addSavedAddress: (address: UserLocation) => void;
  removeSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Cart operations
  addToCart: (item: AddCartBodyType) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItemQuantity: (
    itemId: string,
    quantity: number,
    option: string
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  clearItemCart: (restaurantId: string) => void;
  getCartToServer: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: (id: string) => number | undefined;
  getRestaurantFromCart: () => string | null;
  getFullCart: () => any;
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

  // Orders
  getOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  placeOrder: (order: Partial<Order>) => Order;
  rateOrder: (orderId: string) => void;
  reorderItems: (orderId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userLocation: { address: defaultLocation },
      newLocation: { address: defaultLocation },
      savedAddresses: [],
      cart: [],
      favorites: [],
      recentSearches: [],
      isAuthenticated: true,
      orders: orders,
      checkoutPreferences: {
        selectedVoucher: null,
        tipAmount: 0,
        deliveryOption: "standard",
        includeCutlery: false,
        note: "",
        selectedPaymentMethod: "cash",
        selectedAddress: savedAddresses[0] || { address: defaultLocation },
      },

      setUserLocation: (location) => set({ userLocation: location }),
      setNewLocation: (location) => set({ newLocation: location }),

      getSavedAddresses: async () => {
        const token = await getAccessToken();
        const req = await addressApiRequest.get(token);
        console.log("get address:", req.payload);

        if (req.payload.EC === "0") {
          set({ savedAddresses: req.payload.DT || [] });
        }
      },

      addSavedAddress: (address) =>
        set((state) => {
          const newAddress = {
            ...address,
            id: Date.now().toString(),
            isDefault: state.savedAddresses.length === 0,
          };
          return { savedAddresses: [...state.savedAddresses, newAddress] };
        }),

      removeSavedAddress: (addressId) =>
        set((state) => {
          const updatedAddresses = state.savedAddresses.filter(
            (addr) => addr.id !== addressId
          );

          if (
            state.savedAddresses.find((addr) => addr.id === addressId)
              ?.isDefault &&
            updatedAddresses.length > 0
          ) {
            updatedAddresses[0].isDefault = true;
          }

          return { savedAddresses: updatedAddresses };
        }),

      setDefaultAddress: (addressId) =>
        set((state) => {
          const updatedAddresses = state.savedAddresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          }));

          return { savedAddresses: updatedAddresses };
        }),

      getCartToServer: async () => {
        const token = await getAccessToken();
        const req = await CartApiRequest.get(token);
        console.log("get cart:", req.payload);

        if (req.payload.EC === "0") {
          set({ cart: req.payload.DT || [] });
        }
      },

      addToCart: async (item) => {
        const token = await getAccessToken();
        const req = await CartApiRequest.add(item, token);
        console.log("add cart:", req.payload);

        if (req.payload.EC === "0") {
          set({ cart: req.payload.DT || [] });
        }
      },

      removeFromCart: async (itemId) => {
        const token = await getAccessToken();
        const req = await CartApiRequest.remove(itemId, token);
        console.log("remove cart:", req.payload);

        if (req.payload.EC === "0") {
          set((state) => ({
            cart: state.cart.filter((item) => item.id !== itemId),
          }));
        }
      },

      updateCartItemQuantity: async (itemId, quantity, option) => {
        console.log("tăng nè:", itemId, quantity, option);

        const token = await getAccessToken();
        const req = await CartApiRequest.quantity(
          itemId,
          quantity,
          option,
          token
        );
        console.log("tăng nè:", req.payload);

        if (req.payload.EC === "0") {
          set({ cart: req.payload.DT || [] });
        }
      },

      clearCart: async () => {
        const token = await getAccessToken();
        const req = await CartApiRequest.clear(token);
        console.log("clear cart:", req.payload);

        if (req.payload.EC === "0") {
          set({ cart: [] });
        }
      },

      clearItemCart: (restaurantId) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.restaurantId !== restaurantId),
        })),

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

      getCartItemCount: (id: string) => {
        const { cart } = get();

        const matchedCart = cart.find((c) => c.restaurantId === id);
        // console.log("cart:", matchedCart);
        return matchedCart;
      },

      getRestaurantFromCart: () => {
        const { cart } = get();
        return cart.length > 0 ? cart[0].restaurantId : null;
      },
      getFullCart: () => {
        const { cart } = get();
        return cart
      },

      setSelectedVoucher: (voucher) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            selectedVoucher: voucher,
          },
        })),

      setTipAmount: (amount) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            tipAmount: amount,
          },
        })),

      setDeliveryOption: (optionId) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            deliveryOption: optionId,
          },
        })),

      setIncludeCutlery: (include) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            includeCutlery: include,
          },
        })),

      setNote: (note) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            note: note,
          },
        })),

      setSelectedPaymentMethod: (method) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            selectedPaymentMethod: method,
          },
        })),

      setSelectedAddress: (address) =>
        set((state) => ({
          checkoutPreferences: {
            ...state.checkoutPreferences,
            selectedAddress: address,
          },
        })),

      getAvailableVouchers: () => {
        const { cart } = get();
        const subtotal = get().getCartTotal();

        return vouchers.filter((voucher) => {
          if (!voucher.isAvailable) return false;
          if (subtotal < voucher.minOrderValue) return false;
          return true;
        });
      },

      getUnavailableVouchers: () => {
        const { cart } = get();
        const subtotal = get().getCartTotal();

        return vouchers.filter((voucher) => {
          if (!voucher.isAvailable) return true;
          if (subtotal < voucher.minOrderValue) {
            voucher.unavailableReason = "Min spend does not reach";
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
          case "PERCENT":
            discount = subtotal * (selectedVoucher.discountValue / 100);
            if (
              selectedVoucher.maxDiscount &&
              discount > selectedVoucher.maxDiscount
            ) {
              discount = selectedVoucher.maxDiscount;
            }
            break;

          case "FIXED":
            discount = selectedVoucher.discountValue;
            break;

          case "SHIPPING":
            const deliveryOption = deliveryOptions.find(
              (option) => option.id === checkoutPreferences.deliveryOption
            );
            if (deliveryOption) {
              discount =
                deliveryOption.price * (selectedVoucher.discountValue / 100);
              if (
                selectedVoucher.maxDiscount &&
                discount > selectedVoucher.maxDiscount
              ) {
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

      getOrders: () => {
        return get().orders;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      placeOrder: (orderData) => {
        const { cart, checkoutPreferences } = get();
        const subtotal = get().getCartTotal();
        const discount = get().getAppliedDiscount();

        const deliveryOption = deliveryOptions.find(
          (option) => option.id === checkoutPreferences.deliveryOption
        );

        const orderId = `${Math.floor(
          10000 + Math.random() * 90000
        )}-${Math.floor(100000000 + Math.random() * 900000000)}`;

        const newOrder: Order = {
          id: orderId,
          user: {
            id: "hungthinhh2003",
            name: "hungthinhh2003",
            phoneNumber:
              checkoutPreferences.selectedAddress.id === "1"
                ? "0944034769"
                : "0123456789",
            createdAt: new Date(),
            isGroupLeader: true,
          },
          restaurant: {
            id: cart[0].restaurantId,
            name: cart[0].restaurantName || "Restaurant",
            image: cart[0].image || "https://via.placeholder.com/150",
            address: "Restaurant Address",
          },
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "https://via.placeholder.com/150",
            options: item.options,
          })),
          deliveryAddress: {
            address: checkoutPreferences.selectedAddress.address,
            contactName: "Nguyễn Hùng Thịnh",
            contactPhone:
              checkoutPreferences.selectedAddress.id === "1"
                ? "0944034769"
                : "0123456789",
          },
          deliveryDistance: 2.5,
          deliveryFee: deliveryOption?.price || 15000,
          platformFee: Math.round(subtotal * 0.05),
          subtotal: subtotal,
          discount: discount,
          total:
            subtotal +
            (deliveryOption?.price || 15000) +
            Math.round(subtotal * 0.05) -
            discount +
            checkoutPreferences.tipAmount,
          status: "COMPLETED",
          paymentMethod:
            checkoutPreferences.selectedPaymentMethod === "cash"
              ? "Cash"
              : "ShopeePay",
          paymentStatus: "PAID",
          orderTime: new Date().toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          includeCutlery: checkoutPreferences.includeCutlery,
          note: checkoutPreferences.note,
          canRate: true,
          isRated: false,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      rateOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, isRated: true } : order
          ),
        })),

      reorderItems: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order) return;

        get().clearCart();

        order.items.forEach((item) => {
          get().addToCart({
            id: item.id,
            restaurantId: order.restaurant.id,
            restaurantName: order.restaurant.name,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            options: item.options,
          } as AddCartBodyType);
        });
      },
    }),
    {
      name: "food-delivery-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

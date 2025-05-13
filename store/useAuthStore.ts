import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OtpApiRequest from "@/api/otp.api";
import {
  saveAccessToken,
  getAccessToken,
  removeAccessToken,
} from "@/storange/auth.storage";
import AuthenApiRequest from "@/api/authen.api";

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  isNewUser: boolean;
  verificationId: string | null;
  phoneNumber: string | null;

  // Auth actions
  setPhoneNumber: (phoneNumber: string) => void;
  setVerificationId: (verificationId: string) => void;
  setVerifying: (isVerifying: boolean) => void;
  setIsNewUser: (isNewUser: boolean) => void;
  setUser: (user: User) => void;
 getUser: () => User | null;

  logout: () => void;

  // Mock verification (in a real app, this would be handled by a backend service)
  verifyOtp: (otp: string) => Promise<boolean>;
  requestOtp: (phoneNumber: string) => Promise<string>;
  updateUserProfile: (userData: Partial<User>) => void;

  // Password management
  createPassword: (password: string) => Promise<boolean>;
  login: (phoneNumber: string, password: string) => Promise<boolean>;

  // Mock password storage (in a real app, this would be securely stored on a backend)
  passwords: Record<string, string>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isVerifying: false,
      isNewUser: false,
      verificationId: null,
      phoneNumber: null,
      passwords: {},

      getUser: () => {
        return get().user;
      },
      
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

      setVerificationId: (verificationId) => set({ verificationId }),

      setVerifying: (isVerifying) => set({ isVerifying }),

      setIsNewUser: (isNewUser) => set({ isNewUser }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          isVerifying: false,
          verificationId: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          phoneNumber: null,
          verificationId: null,
        }),

      // Mock OTP request (in a real app, this would call a backend API)
      requestOtp: async (phoneNumber) => {
        // Simulate API call delay
        try {
          const data = await OtpApiRequest.send(phoneNumber);
          console.log("Home data:", data.payload);
          // In a real app, this would send an SMS with the OTP
          console.log(`[MOCK] Sending OTP to ${phoneNumber}`);
          // Check if this is a new user
          const { passwords } = get();
          const isNewUser = !passwords[phoneNumber];

          set({
            phoneNumber,
            isVerifying: data.payload.DT,
            isNewUser,
          });

          return data.payload;
        } catch (error) {
          console.error(error);
        }
      },

      // Mock OTP verification (in a real app, this would call a backend API)
      verifyOtp: async (otp) => {
        const { verificationId, phoneNumber, passwords } = get();

        if (!phoneNumber) {
          return false;
        }

        try {
          console.log("Verification ID:", verificationId);

          const data = await OtpApiRequest.verify(phoneNumber, otp);
          console.log("Home data:", data.payload);
          console.log(`[MOCK] Verify OTP to ${phoneNumber}`);

          // const newVerificationId = data.DT;
          const newUser = true;

          set({
            isVerifying: true,
            isNewUser: true,
          });

          const isValid = data.payload.EC === "0";

          if (isValid && !newUser) {
            const user = {
              id: Math.random().toString(36).substring(2, 15),
              phoneNumber,
              createdAt: new Date(),
            };

           
            
          }

          return isValid;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      createPassword: async (password) => {
        const { phoneNumber } = get();

        if (!phoneNumber) {
          return false;
        }
        function normalizePhoneNumber(phoneNumber: string): string {
          // Bỏ dấu +
          let cleaned = phoneNumber.replace(/^\+/, "");

          // Nếu bắt đầu bằng 84 thì thay bằng 0
          if (cleaned.startsWith("84")) {
            cleaned = "0" + cleaned.slice(2);
          }

          return cleaned;
        }
        const data = await AuthenApiRequest.register(normalizePhoneNumber(phoneNumber), password);
        console.log("data:", data.payload);
        
        if (data.payload.EC !== "0") {
          return false;
        }
        const login = await AuthenApiRequest.login(normalizePhoneNumber(phoneNumber), password);
        if (login.payload.EC !== "0") {
          return false;
        }
        if (!login.payload.DT.access_token) {
          return false;
        }
        set({
          user: {
            role: login.payload.DT.account.role,
          },
          isAuthenticated: true,
          isVerifying: false,
          verificationId: null,
        }),
        await saveAccessToken(login.payload.DT.access_token);
        return true;
      },

      login: async (phoneNumber, password) => {
        // Simulate API call delay
        const login = await AuthenApiRequest.login(phoneNumber, password);
        console.log("login data:", login.payload);

        if (login.payload.EC !== "0") {
          return false;
        }
        if (!login.payload.DT.access_token) {
          return false;
        }
        await saveAccessToken(login.payload.DT.access_token);
        const user = {
          role: login.payload.DT.account.role,
          phoneNumber: login.payload.DT.account.phone,
          avatar: login.payload.DT.account.avatar,
        };

        set({
          user: user,
          isAuthenticated: true,
          isVerifying: false,
          verificationId: null,
        });
        return true;
      },

      updateUserProfile: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...userData,
            },
          });
        }
      },
    }),
    {
      name: "food-delivery-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

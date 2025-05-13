import http from "@/lib/http";
import { AddCartBodyType, CartFullResType } from "@/schema/cart.schema";
const CheckoutApiRequest = {
  getFee: (long:number, lat:number,idRes:string, token: string) =>
    http.post<any>(
      `/api/shipping-fee/${idRes}`,
      { long,lat },
      {
        
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  get: (token: string) =>
    http.get<CartFullResType>("/api/get-cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  quantity: (itemId: string, quantity: number, option: string, token: string) =>
    http.put<CartFullResType>(
      "/api/quantity-cart",
      { itemId, quantity, option },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default CheckoutApiRequest;

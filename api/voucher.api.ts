import http from "@/lib/http";
import { AddCartBodyType, CartFullResType } from "@/schema/cart.schema";
const VoucherApiRequest = {
  get: () =>
    http.get<any>(
      `/api/get-voucher/`
    ),

};

export default VoucherApiRequest;

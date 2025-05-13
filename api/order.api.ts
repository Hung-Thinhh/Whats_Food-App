import { OrderSchema } from './../schema/order.schema';
import http from "@/lib/http";

const orderApiRequest = {
    add: (data: typeof OrderSchema, token:string) =>
      http.post<any>(
        "/api/add-order",
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  };
  export default orderApiRequest;

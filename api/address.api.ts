import { OrderSchema } from './../schema/order.schema';
import http from "@/lib/http";

const addressApiRequest = {
    get: (token:string) =>
      http.get<any>(
        "/api/get-address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      add: (data:any,token:string) =>
        http.post<any>(
          "/api/add-address",
          {data},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
  };
  export default addressApiRequest;

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
      addRating: (data: any, token:string) =>
        http.post<any>(
          "/api/add-rating",
          { data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      get: ( token:string) =>
        http.get<any>(
          "/api/get-order-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        getHis: ( token:string) =>
          http.get<any>(
            "/api/get-order-history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          getCart: ( token:string) =>
            http.get<any>(
              "/api/get-order-Res",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            getOneOrder: ( token:string,id:string) =>
              http.get<any>(
                "/api/getDetailOrder/"+id,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),
  };
  export default orderApiRequest;

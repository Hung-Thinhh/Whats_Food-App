import { OrderSchema } from './../schema/order.schema';
import http from "@/lib/http";

const foodApiRequest = {
    get: (id:string) =>
      http.get<any>(
        `/api/get-food/${id}`,
      ),
  };
  export default foodApiRequest;

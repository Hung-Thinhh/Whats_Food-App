import http from "@/lib/http";
import { RestaurantResType } from "@/schema/restaurant.schema";


const SearchApiRequest = {
    search: (value: string) => http.get<any>(`/api/search?query=${value}`),
  }; 
export default SearchApiRequest;

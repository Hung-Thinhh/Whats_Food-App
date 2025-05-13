import { z } from "zod";

// Zod schema cho một item topping
const ToppingItemSchema = z.object({
  id: z.string(),
  price: z.number(),
});

const ToppingGroupSchema = z.object({
  topping: z.string(), // ObjectId của topping
  item: z.array(ToppingItemSchema),
});

// Zod schema cho một item trong giỏ hàng
const OrderItemSchema = z.object({
  food: z.string(), // ObjectId của món ăn
  quantity: z.number().min(1),
  price: z.number(),
  toppings: z.array(ToppingGroupSchema).optional(),
});

// Zod schema cho địa chỉ giao hàng
const AddressSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  detail: z.string(),
  location: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),
});

// Zod schema cho phần giảm giá (voucher)
const DiscountSchema = z.object({
  voucherId: z.string(),
  amount: z.number(),
}).optional();

// Zod schema cho toàn bộ đơn hàng
export const OrderSchema = z.object({
  user: z.string(),
  restaurant: z.string(),
  items: z.array(OrderItemSchema),
  totalPrice: z.number(),
  shippingFee: z.number(),
  discount: DiscountSchema,
  finalAmount: z.number(),
  address: AddressSchema,
  paymentMethod: z.enum(["COD", "MOMO", "VNPAY"]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  orderStatus: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "delivering",
    "completed",
    "canceled",
  ]),
  note: z.string().optional(),
  shipper: z.string().optional(),
  isRated: z.boolean().default(false),
});

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  loveReact?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  quantity: number;
}

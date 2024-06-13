export interface Product {
  id: number;
  title: string;
  images: Image[];
  currency: string;
  price_min: number;
  addCart: boolean;
  favorited: boolean;
  localID: number;
  compare_at_price_min: number;
  tags: string[];
  "offer-message": string;
}

interface ProductData {
  code: number;
  message: string;
  data: {
    total_product: number;
    products: Product[];
  };
}

interface Image {
  id: string;
  url: string;
}

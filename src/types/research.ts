export interface TrendData {
  source: "google_trends" | "amazon" | "aliexpress";
  keyword: string;
  title?: string;
  price?: number;
  imageUrl?: string;
  link?: string;
  rank?: number;
}

export type SuggestionType = "new_product" | "price_update" | "image_update";

export interface ProductSuggestion {
  type: SuggestionType;
  /** For new_product: full product data. For updates: the target product slug. */
  targetSlug?: string;
  title: string;
  reason: string;
  /** New product fields (only for new_product) */
  product?: {
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    categorySlug: string;
    images: string[];
    features: string[];
    deliveryDays: string;
  };
  /** For price_update */
  newPrice?: number;
  /** For image_update */
  newImages?: string[];
}

export interface PendingSuggestion {
  id: string;
  suggestion: ProductSuggestion;
  token: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ResearchResult {
  trends: TrendData[];
  suggestions: ProductSuggestion[];
  timestamp: string;
}

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  initialized: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "LOAD_CART":
      return { ...state, items: action.items, initialized: true };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    initialized: false,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dropship-cart");
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: "LOAD_CART", items });
      } else {
        dispatch({ type: "LOAD_CART", items: [] });
      }
    } catch {
      dispatch({ type: "LOAD_CART", items: [] });
    }
  }, []);

  useEffect(() => {
    if (state.initialized) {
      localStorage.setItem("dropship-cart", JSON.stringify(state.items));
    }
  }, [state.items, state.initialized]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addItem = useCallback(
    (product: Product) => {
      dispatch({ type: "ADD_ITEM", product });
      setIsDrawerOpen(true);
    },
    []
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );
  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      addToCart: (item) => set((state) => ({ 
        cart: [...state.cart, item], 
        isOpen: true 
      })),
      removeFromCart: (id) => set((state) => ({ 
        cart: state.cart.filter((i) => i.id !== id) 
      })),
      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: 'shopping-cart' }
  )
);
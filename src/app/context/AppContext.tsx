import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  paymentMethod: string;
  status: "received" | "preparing" | "on_the_way" | "delivered";
  createdAt: Date;
  estimatedTime: string;
  user: User;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  currentRestaurantId: string | null;
  setCurrentRestaurantId: (id: string | null) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("foodbot_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("foodbot_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((o: Order) => ({ ...o, createdAt: new Date(o.createdAt) }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("foodbot_user", JSON.stringify(u));
    else localStorage.removeItem("foodbot_user");
  };

  useEffect(() => {
    localStorage.setItem("foodbot_orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        currentRestaurantId,
        setCurrentRestaurantId,
        orders,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

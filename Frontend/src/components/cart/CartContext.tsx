import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartItem {
    id: number;
    name: string;
    brand: string;
    price: number;
    discountPercent: number;
    image: string;
    volume: number;
    quantity: number;
    selected: boolean;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity" | "selected">) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    toggleSelect: (id: number) => void;
    toggleSelectAll: () => void;
    clearCart: () => void;
    totalItems: number;
    selectedItems: CartItem[];
    selectedTotal: number;
    allSelected: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = sessionStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: Omit<CartItem, "quantity" | "selected">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1, selected: true }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const toggleSelect = (id: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, selected: !i.selected } : i
            )
        );
    };

    const toggleSelectAll = () => {
        const allSelected = items.every((i) => i.selected);
        setItems((prev) => prev.map((i) => ({ ...i, selected: !allSelected })));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedItems = items.filter((i) => i.selected);
    const selectedTotal = selectedItems.reduce((sum, item) => {
        const finalPrice = item.price * (1 - item.discountPercent / 100);
        return sum + finalPrice * item.quantity;
    }, 0);
    const allSelected = items.length > 0 && items.every((i) => i.selected);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                toggleSelect,
                toggleSelectAll,
                clearCart,
                totalItems,
                selectedItems,
                selectedTotal,
                allSelected,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

import { create } from 'zustand';
import { TProduct } from '@/schemas';

interface ProductWithQuantity extends TProduct {
    quantity: number;
}

interface TicketState {
    products: ProductWithQuantity[];
    addToTicket: (product: TProduct) => void;
    removeFromTicket: (productId: string) => void;
    adjustQuantity: (productId: string, quantity: number) => void;
    clearTicket: () => void;
}

const useProductStore = create<TicketState>((set) => ({
    products: [],
    addToTicket: (product: TProduct) => {
        set((state) => {
            const productIndex = state.products.findIndex((p) => p.id === product.id);
            if (productIndex !== -1) {
                const newProducts = state.products.map((p, index) =>
                    index === productIndex ? { ...p, quantity: Math.min(p.stock, p.quantity + 1) } : p
                );
                return { products: newProducts };
            } else {
                return { products: [...state.products, { ...product, quantity: 1 }] };
            }
        });
    },
    removeFromTicket: (productId: string) => {
        set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
        }));
    },
    adjustQuantity: (productId: string, quantity: number) => {
        set((state) => ({
            products: state.products.map((product) =>
                product.id === productId ? { ...product, quantity: Math.max(0, product.quantity + quantity) } : product
            ).filter((product) => product.quantity > 0), // Remove product if quantity drops to 0
        }));
    },
    clearTicket: () => {
        set({ products: [] });
    },
}));

export default useProductStore;

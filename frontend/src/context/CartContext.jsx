import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        calculateTotal();
    }, [cart]);

    const calculateTotal = () => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    const addToCart = (product) => {
        const availableStock = product.quantity;

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity + 1 > availableStock) {
                    alert(`Only ${availableStock} ${product.unit || 'units'} available in stock.`);
                    return prevCart;
                }
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            if (availableStock < 1) {
                alert("This product is currently out of stock.");
                return prevCart;
            }

            return [...prevCart, { ...product, quantity: 1, stock: availableStock }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === productId) {
                    if (quantity > item.stock) {
                        alert(`Only ${item.stock} ${item.unit || 'units'} available in stock.`);
                        return item;
                    }
                    return { ...item, quantity: quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

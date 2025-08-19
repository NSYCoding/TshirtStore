import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Cart.css";
import { Link } from "react-router-dom";

type CartItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
};

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart items from localStorage
    useEffect(() => {
        const loadCartItems = () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
                } catch (error) {
                    console.error('Error parsing cart data:', error);
                    setCartItems([]);
                }
            }
        };

        loadCartItems();
    }, []);

    const handleDelete = (id: number) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        const deletedItem = cartItems.find(item => item.id === id);
        if (deletedItem) {
            alert(`${deletedItem.title} has been removed from your cart!`);
        }
    };

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleDelete(id);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <main className="cart">
                    <h2>Your Shopping Cart</h2>
                    <p>Your cart is empty. Go shopping!</p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="cart">
                <h2>Your Shopping Cart ({getTotalItems()} items)</h2>
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.title} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.title}</h3>
                                <p>${item.price}</p>
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span className="quantity">Qty: {item.quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="item-total">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => handleDelete(item.id)} 
                                className="delete-btn"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Total: ${getTotalPrice()}</h3>
                    <button className="checkout-btn"><Link to="/checkout">Proceed to Checkout</Link></button>
                </div>
            </main>
        </>
    );
}

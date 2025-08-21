import { MouseEventHandler } from "react";
import { Product } from "../types";

export default function StoreCard({ card }: { card: Product }) {
    const { title, price, image } = card;

    const storeCardData = {
        id: card.id,
        title,
        price,
        image
    };

    const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        console.log("Add to cart clicked for:", storeCardData);
        
        const existingCart = localStorage.getItem('cart');
        const cartItems = existingCart ? JSON.parse(existingCart) : [];
        
        const itemIndex = cartItems.findIndex((item: any) => item.id === storeCardData.id);
        
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity += 1;
        } else {
            cartItems.push({ ...storeCardData, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert(`${title} has been added to your cart!`);
    }

    return (
        <div className="store-card">
            <img src={card.image} alt={card.title} />
            <div className="content-store-card">
                <span>{card.title}</span>
                <p>${card.price}</p>
                <button onClick={handleAddToCart}>Add</button>
            </div>
        </div>
    );
}
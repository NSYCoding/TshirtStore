import { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
import { Product } from "../types";

type StoreCardsProps = {
    limit?: number;
    searchResults?: Product[];
    isSearching?: boolean;
};

export default function StoreCards({ limit = 6, searchResults = [], isSearching = false }: StoreCardsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isSearching) {
            setProducts(searchResults);
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('https://fakestoreapi.com/products');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchResults, isSearching]);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (isSearching && products.length === 0) {
        return <div className="no-results">No products found matching your search.</div>;
    }

    return (
        <div className="store-cards">
            {products.map((product) => (
                <StoreCard key={product.id} card={product} />
            ))}
        </div>
    );
}
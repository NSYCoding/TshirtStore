import { useState } from "react";
import Navbar from "../components/Navbar";
import StoreCards from "../components/StoreCards";
import SearchBar from "../components/searchbar";
import { Product } from "../types";

export default function Shop() {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    return (
        <main className="shop">
            <Navbar />
            <h2>All Products</h2>
            <SearchBar 
                onSearchResults={setSearchResults} 
                onSearchStateChange={setIsSearching}
            />
            <StoreCards 
                searchResults={searchResults}
                isSearching={isSearching}
            />
        </main>
    );
}
import React, { useEffect, useState } from 'react';
import { Product } from '../types';

type SearchBarProps = {
    onSearchResults: (results: Product[]) => void;
    onSearchStateChange: (isSearching: boolean) => void;
};

export default function SearchBar({ onSearchResults, onSearchStateChange }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [language, setLanguage] = useState('en-US');
    const [translateTo, setTranslateToLanguage] = useState('english');
    const [isTranslating, setIsTranslating] = useState(false);

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    const languageMap: { [key: string]: string } = {
        'english': 'en-US',
        'spanish': 'es-ES',
        'dutch': 'nl-NL',
        'french': 'fr-FR',
        'german': 'de-DE',
        'chinese': 'zh-CN',
        'japanese': 'ja-JP',
        'korean': 'ko-KR',
        'hindi': 'hi-IN',
        'italian': 'it-IT',
        'arabic': 'ar-SA'
    };

    const translateLanguageMap: { [key: string]: string } = {
        'english': 'en',
        'spanish': 'es',
        'dutch': 'nl',
        'french': 'fr',
        'german': 'de',
        'chinese': 'zh',
        'japanese': 'ja',
        'korean': 'ko',
        'hindi': 'hi',
        'italian': 'it',
        'arabic': 'ar'
    };

    const translateText = async (text: string, targetLang: string): Promise<string> => {
        if (targetLang === 'en' || targetLang === 'english') return text;
        
        try {
            if ('translation' in navigator) {
                const translator = await (navigator as any).translation.createTranslator({
                    sourceLanguage: 'en',
                    targetLanguage: targetLang
                });
                const result = await translator.translate(text);
                return result || text;
            }

            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    function handleSpeak() {
        if (!recognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        recognition.lang = language;
        recognition.onstart = () => {
            console.log("Voice recognition started. Try speaking into the microphone.");
        };
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            console.log("You said:", transcript);
            setQuery(transcript.toLowerCase());
        };
        recognition.onspeechend = () => {
            console.log("Voice recognition ended.");
            recognition.stop();
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.start();
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value.toLowerCase();
        fetch(`https://fakestoreapi.com/products?search=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                setQuery(searchQuery);
                onSearchResults(data);
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
            });
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        const langCode = languageMap[selectedLanguage] || 'en-US';
        setLanguage(langCode);
        console.log("Selected voice language:", selectedLanguage, "Code:", langCode);
    };

    const handleTranslateLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        setTranslateToLanguage(selectedLanguage);
        console.log("Selected translation language:", selectedLanguage);
    };

    useEffect(() => {
        if (query.trim() === '') {
            onSearchStateChange(false);
            onSearchResults([]);
            return;
        }

        onSearchStateChange(true);

        const fetchAndTranslateProducts = async () => {
            try {
                setIsTranslating(translateTo !== 'english');
                
                const response = await fetch('https://fakestoreapi.com/products');
                const data: Product[] = await response.json();
                
                const filtered = data.filter(product =>
                    product.title.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );

                if (translateTo !== 'english') {
                    const targetLang = translateLanguageMap[translateTo];
                    console.log(`Translating to ${translateTo} (${targetLang})`);
                    
                    const translatedProducts = await Promise.all(
                        filtered.map(async (product) => {
                            try {
                                const [translatedTitle, translatedDescription, translatedCategory] = await Promise.all([
                                    translateText(product.title, targetLang),
                                    translateText(product.description, targetLang),
                                    translateText(product.category, targetLang)
                                ]);
                                
                                return {
                                    ...product,
                                    title: translatedTitle,
                                    description: translatedDescription,
                                    category: translatedCategory
                                };
                            } catch (error) {
                                console.error(`Translation failed for product ${product.id}:`, error);
                                return product;
                            }
                        })
                    );
                    
                    setIsTranslating(false);
                    onSearchResults(translatedProducts);
                } else {
                    setIsTranslating(false);
                    onSearchResults(filtered);
                }
            } catch (error) {
                console.error("Error fetching or translating search results:", error);
                setIsTranslating(false);
                onSearchResults([]);
            }
        };

        fetchAndTranslateProducts();
    }, [query, translateTo, onSearchResults, onSearchStateChange]);

    return (
        <div className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={handleSearch}
                />
                {recognition && (
                    <button onClick={handleSpeak} className="voice-search-button">
                        <span role="img" aria-label="microphone">🎤</span>
                    </button>
                )}
                {isTranslating && (
                    <span className="translating-indicator">Translating...</span>
                )}
            </div>
            <div className="language-controls">
                {recognition && (
                    <div>
                        <label htmlFor="language-select">Voice Language:</label>
                        <select 
                            name="language" 
                            id="language-select" 
                            onChange={handleLanguageChange}
                            defaultValue="english"
                        >
                            {['english', 'spanish', 'dutch', 'french', 'german', 'chinese', 'japanese', 'korean', 'hindi', 'italian', 'arabic'].map(lang => (
                                <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label htmlFor="translate-select">Translate To:</label>
                    <select 
                        name="translate" 
                        id="translate-select" 
                        onChange={handleTranslateLanguageChange}
                        defaultValue="english"
                    >
                        {['english', 'spanish', 'dutch', 'french', 'german', 'chinese', 'japanese', 'korean', 'hindi', 'italian', 'arabic'].map(lang => (
                            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
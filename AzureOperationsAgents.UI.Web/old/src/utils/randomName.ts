// src/utils/randomName.ts

import i18n from 'i18next';

const words: Record<string, string[]> = {
    en: ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "orange", "peach", "quince", "raspberry", "strawberry", "tangerine"],
    es: ["manzana", "plátano", "cereza", "dátil", "saúco", "higo", "uva", "melón", "kiwi", "limón", "mango", "naranja", "melocotón", "membrillo", "frambuesa", "fresa", "mandarina"],
    fr: ["pomme", "banane", "cerise", "datte", "sureau", "figue", "raisin", "melon", "kiwi", "citron", "mangue", "orange", "pêche", "coing", "framboise", "fraise", "mandarine"]
};

function getCurrentLanguage(): string {
    const language = i18n.language.split('-')[0]; // Get the language code (e.g., 'en' from 'en-US')
    return words[language] ? language : 'en'; // Default to 'en' if the language is not supported
}

export function getRandomWords(count: number): string[] {
    const language = getCurrentLanguage();
    const availableWords = words[language];
    
    // If requested count is greater than available words, return all words
    if (count >= availableWords.length) {
        return [...availableWords];
    }
    
    // Get random words
    const randomWords: string[] = [];
    const wordsCopy = [...availableWords];
    
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * wordsCopy.length);
        randomWords.push(wordsCopy[randomIndex]);
        wordsCopy.splice(randomIndex, 1); // Remove selected word to avoid duplicates
    }
    
    return randomWords;
}

// Get a single random word
export function getRandomWord(): string {
    return getRandomWords(1)[0];
}
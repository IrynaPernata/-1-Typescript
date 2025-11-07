"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Створення функцій для пошуку товарів
/**
 * Знаходить товар у масиві за його ID.
 * Використовує Generic T, який має розширювати BaseProduct.
 */
const findProduct = (products, id) => {
    return products.find(product => product.id === id);
};
/**
 * Фільтрує товари за максимальною ціною
 */
const filterByPrice = (products, maxPrice) => {
    return products.filter(product => product.price <= maxPrice);
};
// Додає товар у кошик.
const addToCart = (cart, product, quantity) => {
    if (quantity <= 0) {
        console.error('Quantity must be greater than 0');
        return cart;
    }
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingItemIndex > -1) {
        // Товар вже є в кошику - змінює кількість
        const updatedCart = [...cart];
        const existingItem = updatedCart[existingItemIndex];
        if (existingItem) {
            updatedCart[existingItemIndex] = Object.assign(Object.assign({}, existingItem), { quantity: existingItem.quantity + quantity });
        }
        return updatedCart;
    }
    else {
        // Додає новий товар у кошик
        return [...cart, { product, quantity }];
    }
};
// Підрахунок загальної вартості
const calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
};
//Використання функцій
//Створення тестових даних ---
const electronics = [
    {
        id: 1,
        name: 'Смартфон "Samsung V10"',
        price: 29999,
        description: 'Флагманський смартфон.',
        category: 'electronics',
        warranty: 24,
        brand: 'FluxTech',
    },
    {
        id: 2,
        name: 'Ноутбук "Nout Pro"',
        price: 64999,
        description: 'Ігровий ноутбук',
        category: 'electronics',
        warranty: 36,
        brand: 'Nout',
    },
];
const clothing = [
    {
        id: 3,
        name: 'Футболка біла',
        price: 899,
        description: 'Базова біла футболка з бавовни.',
        category: 'clothing',
        size: 'L',
        color: 'біла',
    },
    {
        id: 4,
        name: 'Джинси Fit',
        price: 2499,
        description: 'Класичні джинси.',
        category: 'clothing',
        size: 'M',
        color: 'Синій',
    },
];
const books = [
    {
        id: 5,
        name: 'TypeScript',
        price: 1200,
        description: 'Все, що треба знати про TS.',
        category: 'book',
        author: 'Ірина Перната',
        pages: 420,
    },
];
const phone = findProduct(electronics, 1);
console.log('Знайдено телефон:', phone === null || phone === void 0 ? void 0 : phone.name);
const book = findProduct(books, 5);
console.log('Знайдено книгу:', book === null || book === void 0 ? void 0 : book.name);
const nonExistent = findProduct(clothing, 99);
console.log('Неіснуючий товар:', nonExistent);
const cheapElectronics = filterByPrice(electronics, 30000);
console.log('Електроніка до 30000 грн:', cheapElectronics.map(item => item.name));
const cheapClothing = filterByPrice(clothing, 1000);
console.log('Одяг до 1000 грн:', cheapClothing.map(item => item.name));
let mixedCart = [];
if (phone) {
    mixedCart = addToCart(mixedCart, phone, 1);
    console.log('Додано телефон у кошик.');
}
if (book) {
    mixedCart = addToCart(mixedCart, book, 2);
    console.log('Додано 2 книги у кошик.');
}
if (phone) {
    mixedCart = addToCart(mixedCart, phone, 1);
    console.log('Додано ЩЕ 1 телефон. Кількість має оновитись.');
}
console.log('\nФінальний стан кошика: ');
console.log(JSON.stringify(mixedCart, null, 2));
const total = calculateTotal(mixedCart);
console.log(`\nЗагальна сума кошика: ${total} грн`);
if (phone) {
    console.log(`Гарантія на телефон: ${phone.warranty} міс.`);
}
if (book) {
    console.log(`Автор книги: ${book.author}`);
}
let clothingCart = [];
const tshirt = findProduct(clothing, 3);
if (tshirt) {
    clothingCart = addToCart(clothingCart, tshirt, 1);
    console.log('Створено кошик лише для одягу.');
}
//# sourceMappingURL=shop.js.map
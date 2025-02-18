// Перевірка, чи ми на сторінці cart.html
if (window.location.pathname === '/cart') {
    const loadCartPage = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItems = document.getElementById('cart-items');
        const totalPriceElem = document.getElementById('total-price');

        if (!cartItems || !totalPriceElem) return;
        console.log(cart);
        // Відображення товарів у кошику
        cartItems.innerHTML = cart.length > 0 
            ? cart.map((item, index) => `
                <div class="cart-item">
                    <img class="cart-image" src="${item.image}" alt="${item.name}" />
                    <p>${item.name} - ${item.price} грн</p>
                    <button class="remove-btn" data-index="${index}">Видалити</button>
                </div>
            `).join('')
            : '<p>Кошик порожній</p>';

        // Відображення загальної суми
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElem.textContent = `Загальна сума: ${totalPrice} грн`;

        // Додаємо обробники для кнопок "Видалити"
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                cart.splice(index, 1); // Видаляємо товар
                localStorage.setItem('cart', JSON.stringify(cart)); // Оновлюємо localStorage
                loadCartPage(); // Перезавантажуємо сторінку кошика
            });
        });
    };

    // Завантажуємо дані на сторінці cart.html
    loadCartPage();
}


// Обробник події для кнопки "Оформити замовлення"
document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cart }),
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url; // Redirect if needed
        }
        return response.json();
    })
    .then(data => {
        console.log('Замовлення оформлене', data);
        localStorage.removeItem('cart'); // Очищення кошика
        window.location.href = '/'; // Перенаправлення на сторінку підтвердження
    })
    .catch(error => {
        console.error('Помилка при оформленні замовлення:', error);
    });
});


// Масив для зберігання товарів у кошику
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Елементи DOM для кошика та інших компонентів
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPriceElem = document.getElementById('total-price');
const cartElement = document.getElementById('cart');
const closeCartBtn = document.getElementById('close-cart');

// Функція для оновлення відображення кошика
const updateCart = () => {
    // Оновлюємо кількість товарів у кошику
    cartCount.textContent = cart.length;

    // Зберігаємо кошик у localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Якщо ми на сторінці cart.html, оновлюємо відображення
    if (cartItems && totalPriceElem) {
        // Оновлюємо список товарів
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img class="cart-image" src="${item.image}" alt="${item.name}" />
                <p>${item.name} - ${item.price} грн</p>
                <button class="remove-btn" data-index="${index}">Видалити</button>
            </div>
        `).join('');

        // Оновлюємо загальну суму
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElem.textContent = `Загальна сума: ${totalPrice} грн`;

        // Додаємо обробники для кнопок "Видалити"
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
};

// Функція для додавання товару до кошика
const addToCart = (bookName, bookPrice, imageLink) => {
    cart.push({ name: bookName, price: bookPrice, image: imageLink });
    updateCart();
};

// Обробник подій для кнопок "Купити"
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Find the specific .book-card div that contains the clicked button
        const bookCard = button.closest('.book-card');

        // Extract information from the specific book card
        const bookName = button.getAttribute('data-book');
        const bookPrice = parseFloat(button.getAttribute('data-price'));
        const bookImage = bookCard.querySelector('img').getAttribute('src');
        
        console.log(bookImage);

        // Validate the data
        if (!bookName || isNaN(bookPrice)) {
            console.error('Невірні дані для товару');
            return;
        }

        // Add the book to the cart
        addToCart(bookName, bookPrice, bookImage);
    });
});

// Відкриття/закриття кошика
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartElement.classList.toggle('open');
    });
}

// Закриття кошика
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartElement.classList.remove('open');
    });
}

// Завантажуємо дані при відкритті сторінки
updateCart();

// TEST
// 

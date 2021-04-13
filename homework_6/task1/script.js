const catalog = {
    catalog: null,
    cart: null,
    listItems: [
        {
            product_id: 1,
            product_name: "Видеокарта",
            price: 35000,
            quantity: 1
        },
        {
            product_id: 2,
            product_name: "Оперативная память",
            price: 3000,
            quantity: 2
        },
        {
            product_id: 3,
            product_name: 'Мышка',
            price: 1000,
            quantity: 1,
        }
    ],

    init(catalogClass, cart) {
        this.catalog = document.querySelector(`.${catalogClass}`);
        this.cart = cart;
        this.render();
        this.addEventHandlers();
    },

    render() {
        if (this.listItems.length > 0) {
            this.renderCatalog();
        } else {
            this.renderEmpty();
        }
    },

    addEventHandlers() {
        this.catalog.addEventListener('click', (event) => this.addToCart(event));
    },

    addToCart(event) {
        if (!event.target.classList.contains('product__add-to-cart-btn')) return;

        const productId = +event.target.dataset.product_id;
        const selectedProduct = this.listItems.find((product) => product.product_id === productId);
        this.cart.addGood(selectedProduct);
    },

    renderCatalog() {
        this.catalog.innerHTML = '';
        this.listItems.forEach((item) => {
            this.catalog.insertAdjacentHTML('beforeend', this.renderItem(item));
        });
    },

    renderItem(item) {
        return `<div class="product">
                <h3>${item.product_name}</h3>
                <p>${item.price} руб.</p>
                <button class="product__add-to-cart-btn" data-product_id="${item.product_id}">В корзину</button>
            </div>`;
    },

    renderEmpty() {
        this.catalog.innerHTML = '';
        this.catalog.textContent = 'Каталог товаров пуст';
    },
};

const cart = {
    cart: null,
    clearCartBtn: null,
    goods: [
        {
            product_id: 1,
            product_name: "Видеокарта",
            price: 35000,
            quantity: 1
        }
    ],

    init(classCart, classClearButton) {
        this.cart = document.querySelector(`.${classCart}`);
        this.clearCartBtn = document.querySelector(`.${classClearButton}`);

        this.addEventHandlers();
        this.render();
    },
    
    addEventHandlers() {
        this.clearCartBtn.addEventListener('click', this.clearCart.bind(this));
    },

    clearCart() {
        this.goods = [];
        this.render();
    },

    render() {
        if (this.goods.length > 0) {
            this.renderCart();
        } else {
            this.renderEmpty();
        }
    },

    renderCart() {
        this.cart.innerHTML = '';
        this.goods.forEach((item) => {
            this.cart.insertAdjacentHTML('beforeend', this.renderCartItem(item));
        });
    },

    renderCartItem(item) {
        return `<div class="good" data-product_id="${item.product_id}">
                <h3>${item.product_name}</h3>
                <p>${item.price} руб.</p>
                <p class="quantity">${item.quantity} шт.</p>
            </div>`;
    },

    renderEmpty() {
        this.cart.innerHTML = '';
        this.cart.textContent = 'Корзина пуста.';
    },

    addGood(product) {
        if (product) {
            const selectedGood = this.goods.find((item) => item.product_id === product.product_id);
            if (selectedGood) {
                selectedGood.quantity++;
                this.update(selectedGood);
            } else {
                this.goods.push(Object.assign({quantity: 1}, product));
                this.render();
            }
            
        } else {
            alert('Ошибка добавления!');
        }
    },

    update(good) {
        const cartItems = document.getElementsByClassName('good');

        for (let i = 0; i < cartItems.length; i++) {
            if (+cartItems[i].dataset.product_id === good.product_id) {
                const quantity = cartItems[i].querySelector('.quantity');
                quantity.textContent = good.quantity + ' шт.';
                break;
            }
        }
    }
};


catalog.init('catalog', cart);
cart.init('cart', 'cart-clear-btn');
const cartItem = {
    render(good) {
        return `<div class="good">
                    <div><b>Наименование</b>: ${good.product_name}</div>
                    <div><b>Цена за шт.</b>: ${good.price}</div>
                    <div><b>Количество</b>: ${good.quantity}</div>
                    <div><b>Стоимость</b>: ${good.quantity * good.price}</div>
                </div>`;
    }
};

const cart = {
    cartList: null,
    clearCartBtn: null,
    cartItem,
    goods: [
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
    init() {
        this.cartList = document.querySelector('.cart-list');
        this.clearCartButton = document.querySelector('.cart-btn');
        this.clearCartButton.addEventListener('click', () => this.clearCart());

        this.render();
    },
    render() {
        if (this.goods.length) {
            this.goods.forEach(good => {
                this.cartList.insertAdjacentHTML('beforeend', this.cartItem.render(good));
            });
            this.cartList.insertAdjacentHTML('beforeend', `В корзине ${this.getNumGoods()} товаров стоимостью ${this.getCartPrice()}`);
        } else {
            this.cartList.textContent = 'Корзина пуста';
        }
    },
    getNumGoods() {
        return this.goods.reduce((totalQuantity, good) => totalQuantity + good.quantity, 0);
    },
    getCartPrice() {
        return this.goods.reduce((totalPrice, good) => totalPrice + good.price * good.quantity, 0);
    },
    clearCart() {
        this.goods = [];
        this.render();
    },
};

cart.init();
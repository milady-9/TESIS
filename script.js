// =======================================================
// NAVEGACIÓN / HEADER
// =======================================================
const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-menu li a');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =======================================================
// LIGHTBOX GALERÍA
// =======================================================
const modal = document.getElementById('lightbox-modal');
const modalImg = document.getElementById('lightbox-image');
const modalCaption = document.getElementById('lightbox-caption');

window.openLightbox = function (src, caption) {
    if (!modal || !modalImg || !modalCaption) return;
    modal.style.display = 'flex';
    modalImg.src = src;
    modalCaption.textContent = caption || '';
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeLightbox();
        }
    });
}

// =======================================================
// CARRITO + PAYPAL + PESTAÑAS
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartPanel = document.getElementById('cart-panel');
    const cartToggleBtn = document.querySelector('.cart-icon-btn');
    const cartCloseBtn = document.querySelector('.cart-close');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const cartEmptyText = document.querySelector('.cart-empty-text');
    const paypalContainer = document.getElementById('paypal-button-container');

    let cart = [];
    let cartTotal = 0;

    function updateCartCount() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalQty;
        }
    }

    function renderCart() {
        if (!cartItemsList || !cartTotalElement) return;

        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            if (cartEmptyText) cartEmptyText.style.display = 'block';
            cartTotal = 0;
            cartTotalElement.textContent = '0.00';
        } else {
            if (cartEmptyText) cartEmptyText.style.display = 'none';

            cartTotal = 0;
            cart.forEach((item, index) => {
                cartTotal += item.price * item.quantity;

                const li = document.createElement('li');
                li.classList.add('cart-item-row');
                li.innerHTML = `
                    <div class="cart-item-main">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$ ${item.price.toFixed(2)} USD</span>
                    </div>
                    <div class="cart-item-controls">
                        <button type="button" class="cart-btn cart-decrease" data-index="${index}">−</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button type="button" class="cart-btn cart-increase" data-index="${index}">+</button>
                        <button type="button" class="cart-btn cart-remove" data-index="${index}">Quitar</button>
                    </div>
                    <div class="cart-item-subtotal">
                        Subtotal: $ ${(item.price * item.quantity).toFixed(2)}
                    </div>
                `;
                cartItemsList.appendChild(li);
            });

            cartTotalElement.textContent = cartTotal.toFixed(2);
        }

        updateCartCount();
    }

    function addToCart(name, price) {
        price = parseFloat(price);
        if (isNaN(price)) return;

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        renderCart();
    }

    // Botones "Agregar al carrito"
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            addToCart(name, price);

            // Abrir carrito automáticamente
            if (cartPanel) {
                cartPanel.classList.add('open');
                document.body.classList.add('cart-open');
            }
        });
    });

    // Abrir / cerrar panel de carrito
    if (cartToggleBtn && cartPanel) {
        cartToggleBtn.addEventListener('click', () => {
            cartPanel.classList.toggle('open');
            document.body.classList.toggle('cart-open');
        });
    }

    if (cartCloseBtn && cartPanel) {
        cartCloseBtn.addEventListener('click', () => {
            cartPanel.classList.remove('open');
            document.body.classList.remove('cart-open');
        });
    }

    // Cerrar carrito con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('open')) {
            cartPanel.classList.remove('open');
            document.body.classList.remove('cart-open');
        }
    });

    // Delegación en items del carrito (aumentar, disminuir, quitar)
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (index === null) return;

            const i = parseInt(index);
            if (isNaN(i) || !cart[i]) return;

            if (e.target.classList.contains('cart-increase')) {
                cart[i].quantity += 1;
            } else if (e.target.classList.contains('cart-decrease')) {
                cart[i].quantity -= 1;
                if (cart[i].quantity <= 0) {
                    cart.splice(i, 1);
                }
            } else if (e.target.classList.contains('cart-remove')) {
                cart.splice(i, 1);
            }

            renderCart();
        });
    }

    // PAYPAL
    if (paypalContainer && typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                if (cart.length === 0 || cartTotal <= 0) {
                    alert('Tu carrito está vacío. Agrega al menos un plan antes de pagar.');
                    return;
                }

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: cartTotal.toFixed(2)
                        },
                        description: 'Servicios de producción audiovisual - Mily Productions'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Pago completado por ' + details.payer.name.given_name + '. ¡Gracias por tu confianza!');

                    cart = [];
                    renderCart();
                });
            },
            onError: function(err) {
                console.error('Error en el pago:', err);
                alert('Ocurrió un error al procesar el pago. Inténtalo nuevamente o contáctanos.');
            }
        }).render('#paypal-button-container');
    } else if (paypalContainer) {
        console.warn('PayPal SDK no está disponible. Verifica el Client ID en el script.');
    }

    // =======================================================
    // PESTAÑAS DENTRO DEL CARRITO
    // =======================================================
    const cartTabs = document.querySelectorAll('.cart-tab');
    const cartTabContents = document.querySelectorAll('.cart-tab-content');

    function activateCartTab(tabName) {
        cartTabs.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });
        cartTabContents.forEach(content => {
            content.classList.toggle(
                'active',
                content.getAttribute('data-tab-content') === tabName
            );
        });
    }

    cartTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            activateCartTab(tabName);
        });
    });

    // Render inicial
    renderCart();
});

let cart = [];
let cartTotal = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => navMenu.classList.remove("open"));
    });
  }

  // Carrito lateral
  const cartPanel = document.getElementById("cart-panel");
  const cartIconBtn = document.querySelector(".cart-icon-btn");
  const cartCloseBtn = document.querySelector(".cart-close");
  const cartCountEl = document.getElementById("cart-count");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const emptyTextEl = document.querySelector(".cart-empty-text");

  function openCart() {
    if (cartPanel) cartPanel.classList.add("open");
  }

  function closeCart() {
    if (cartPanel) cartPanel.classList.remove("open");
  }

  if (cartIconBtn) cartIconBtn.addEventListener("click", openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);

  // Tabs del carrito
  const cartTabs = document.querySelectorAll(".cart-tab");
  const cartTabContents = document.querySelectorAll(".cart-tab-content");

  cartTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      cartTabs.forEach(t => t.classList.remove("active"));
      cartTabContents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document
        .querySelector(`.cart-tab-content[data-tab-content="${target}"]`)
        .classList.add("active");
    });
  });

  // Agregar al carrito
  const addButtons = document.querySelectorAll(".add-to-cart");

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price || "0");

      if (!name || isNaN(price)) return;

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      openCart();
    });
  });

  function updateCartUI() {
    // Cantidad
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems.toString();

    // Lista
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      if (emptyTextEl) emptyTextEl.style.display = "block";
    } else {
      if (emptyTextEl) emptyTextEl.style.display = "none";

      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.name} x${item.qty}</span>
          <span>
            $${(item.price * item.qty).toFixed(2)}
            <button data-index="${index}" aria-label="Quitar del carrito">x</button>
          </span>
        `;
        cartItemsEl.appendChild(li);
      });

      // Botones quitar
      cartItemsEl.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.index, 10);
          if (!isNaN(i)) {
            cart.splice(i, 1);
            updateCartUI();
          }
        });
      });
    }

    // Total
    cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = cartTotal.toFixed(2);
  }

  // PAYPAL
  if (window.paypal) {
    try {
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
          createOrder: function (data, actions) {
            const amount = cartTotal > 0 ? cartTotal.toFixed(2) : "0.01"; // mínimo
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: "USD",
                  },
                  description: "Planes Mily Productions",
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function () {
              alert("¡Pago realizado con éxito! Nos pondremos en contacto contigo.");
              cart = [];
              updateCartUI();
            });
          },
          onError: function (err) {
            console.error("Error PayPal:", err);
          },
        })
        .render("#paypal-button-container");
    } catch (e) {
      console.error("No se pudo inicializar PayPal:", e);
    }
  }
});

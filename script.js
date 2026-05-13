
//cart State
let cart = JSON.parse(localStorage.getItem('radiant-cart') || '[]');

function saveCart() {
    localStorage.setItem('radiant-cart', JSON.stringify(cart));
}

function getTotalCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getTotalPrice() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

//update all cart count badges
function updateCartUI() {
    const count = getTotalCount();
    document.querySelectorAll('.cart-count, .cart-badge').forEach(el => {
        el.textContent = count;
    });
    renderCartItems();
}

//add to cart
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price: Number(price), qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${name} added to cart ✓`);
}

//remove from cart
function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    updateCartUI();
}

//render cart items panel
function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        if (totalEl) totalEl.textContent = '$0';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} × ${item.qty}</div>
            </div>
            <button class="cart-item-remove" data-name="${item.name}">✕</button>
        </div>
    `).join('');

    if (totalEl) totalEl.textContent = `$${getTotalPrice()}`;

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
    });
}

//toast notification
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

//cart panel toggle
function initCartPanel() {
    const cartBtn = document.querySelector('.cart-btn');
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-close');

    if (!panel) return;

    function openCart() {
        panel.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        panel.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    if (overlay) overlay.addEventListener('click', closeCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
}

//add to cart buttons
function initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = btn.dataset.name;
            const price = btn.dataset.price || 50;
            addToCart(name, price);

            btn.classList.add('added');
            const orig = btn.textContent;
            btn.textContent = 'Added! ✓';
            setTimeout(() => {
                btn.textContent = orig;
                btn.classList.remove('added');
            }, 1200);
        });
    });
}

//catalog filter buttons
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.catalog-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

//scroll reveal 
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

//email subscribe form 
function initPromoForm() {
    document.querySelectorAll('.promo-form').forEach(form => {
        const btn = form.querySelector('button');
        const input = form.querySelector('input');
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            if (!input.value || !input.value.includes('@')) {
                showToast('Please enter a valid email');
                return;
            }
            showToast('Subscribed! 20% off code sent ✓');
            input.value = '';
        });
    });
}

// init
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initCartPanel();
    initAddToCartButtons();
    initFilters();
    initReveal();
    initPromoForm();
});
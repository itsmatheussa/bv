// ─── Hamburger Menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
});
navOverlay.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ─── Navbar scroll shadow ─────────────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ─── Scroll Reveal (Intersection Observer) ───────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.style.getPropertyValue('--delay') || '0s';
            el.style.transitionDelay = delay;
            el.classList.add('revealed');
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Modal ────────────────────────────────────────────────────
const modal = document.getElementById('successModal');
function openModal() {
    modal.style.display = 'block';
    modal.querySelector('.modal-content').style.animation = 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards';
}
function closeModal() { modal.style.display = 'none'; }
window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// ─── Toast ────────────────────────────────────────────────────
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const icon  = toast.querySelector('i');
    document.getElementById('toastMsg').textContent = message;
    icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check';
    toast.className = 'toast' + (isError ? ' error' : '');
    // Force reflow to restart animation
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ─── Cart State ───────────────────────────────────────────────
let cart = [];

function renderCart() {
    const cartEmpty   = document.getElementById('cartEmpty');
    const cartItemsEl = document.getElementById('cartItems');
    const submitBtn   = document.getElementById('submitBtn');

    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItemsEl.innerHTML   = '';
        submitBtn.disabled      = true;
        return;
    }

    cartEmpty.style.display = 'none';
    submitBtn.disabled       = false;

    const grouped = {};
    cart.forEach((entry, index) => {
        if (!grouped[entry.game]) grouped[entry.game] = [];
        grouped[entry.game].push({ ...entry, index });
    });

    cartItemsEl.innerHTML = Object.entries(grouped).map(([game, items]) => `
        <div class="cart-game-group">
            <div class="cart-game-label"><i class="fas fa-gamepad"></i> ${game}</div>
            ${items.map(({ item, price, index }) => `
                <div class="cart-item" id="cart-item-${index}">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item}</span>
                        <span class="cart-item-price">${price}</span>
                    </div>
                    <button type="button" class="cart-remove-btn" onclick="removeItem(${index})" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function addItem(game, item, price) {
    const exists = cart.find(e => e.game === game && e.item === item);
    if (exists) {
        showToast(`"${item}" is already in your order!`, true);
        return;
    }

    cart.push({ game, item, price });
    renderCart();
    showToast(`${item} added to your order!`);

    // Pulse the form
    const formSection = document.querySelector('.gifts-form');
    formSection.classList.add('pulse');
    setTimeout(() => formSection.classList.remove('pulse'), 400);

    setTimeout(() => {
        document.getElementById('gifts').scrollIntoView({ behavior: 'smooth' });
    }, 700);
}

function removeItem(index) {
    const el = document.getElementById(`cart-item-${index}`);
    if (el) {
        el.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => { cart.splice(index, 1); renderCart(); }, 200);
    } else {
        cart.splice(index, 1);
        renderCart();
    }
}

// ─── Form Submission ──────────────────────────────────────────
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        showToast('Please select at least one item!', true);
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled  = true;

    const contact    = document.getElementById('contactInfo').value;
    const robloxNick = document.getElementById('robloxNick').value;
    const notes      = document.getElementById('message').value;

    const grouped = {};
    cart.forEach(({ game, item, price }) => {
        if (!grouped[game]) grouped[game] = [];
        grouped[game].push(`${item} (${price})`);
    });

    const itemsSummary = Object.entries(grouped)
        .map(([game, items]) => `[${game}] ${items.join(', ')}`)
        .join(' | ');

    const gamesStr = [...new Set(cart.map(e => e.game))].join(', ');

    const payload = {
        _subject: `🎁 New EasyBux Order: ${gamesStr}`,
        Customer:      contact,
        Roblox_User:   robloxNick,
        Games:         gamesStr,
        Items:         itemsSummary,
        Notes:         notes || 'None',
        _captcha:      'false'
    };

    const FORM_URL = 'https://formsubmit.co/ajax/ang3lagency@gmail.com';

    try {
        const response = await fetch(FORM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            cart = [];
            renderCart();
            this.reset();
            openModal();
        } else {
            showToast('Error sending. Check your FormSubmit email.', true);
        }
    } catch (err) {
        console.error(err);
        showToast('Connection failed. Please try again.', true);
    } finally {
        submitBtn.innerText = 'Send Order';
        submitBtn.disabled  = cart.length === 0;
    }
});

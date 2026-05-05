// ─── Cart State ───────────────────────────────────────────────
let cart = []; // [{ game, item, price }]

// ─── Modal ────────────────────────────────────────────────────
const modal = document.getElementById("successModal");
function openModal() { modal.style.display = "block"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

// ─── Toast ────────────────────────────────────────────────────
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Cart Rendering ───────────────────────────────────────────
function renderCart() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsEl = document.getElementById('cartItems');
    const submitBtn = document.getElementById('submitBtn');

    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItemsEl.innerHTML = '';
        submitBtn.disabled = true;
        return;
    }

    cartEmpty.style.display = 'none';
    submitBtn.disabled = false;

    // Group items by game
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

// ─── Add Item ─────────────────────────────────────────────────
function addItem(game, item, price) {
    // Check for duplicate
    const exists = cart.find(e => e.game === game && e.item === item);
    if (exists) {
        showToast(`"${item}" is already in your order!`);
        return;
    }

    cart.push({ game, item, price });
    renderCart();

    showToast(`✓ ${item} added to your order!`);

    // Pulse the order section badge
    const formSection = document.querySelector('.gifts-form');
    formSection.style.transform = 'scale(1.01)';
    setTimeout(() => { formSection.style.transform = 'scale(1)'; }, 250);

    // Scroll to form after short delay
    setTimeout(() => {
        document.getElementById('gifts').scrollIntoView({ behavior: 'smooth' });
    }, 600);
}

// ─── Remove Item ──────────────────────────────────────────────
function removeItem(index) {
    const el = document.getElementById(`cart-item-${index}`);
    if (el) {
        el.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            cart.splice(index, 1);
            renderCart();
        }, 200);
    } else {
        cart.splice(index, 1);
        renderCart();
    }
}

// ─── Form Submission ──────────────────────────────────────────
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        showToast('Please select at least one item!');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const contact = document.getElementById('contactInfo').value;
    const notes = document.getElementById('message').value;

    // Format items grouped by game
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
        Customer: contact,
        Games: gamesStr,
        Items: itemsSummary,
        Notes: notes || "None",
        _captcha: "false"
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
            alert('Error sending order. Please check your FormSubmit email is activated.');
        }
    } catch (err) {
        console.error(err);
        alert('Connection failed. Please try again.');
    } finally {
        submitBtn.innerText = 'Send Order';
        submitBtn.disabled = cart.length === 0;
    }
});

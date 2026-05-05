
// Modal logic
const modal = document.getElementById("successModal");
function openModal() { modal.style.display = "block"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

const selectionArea = document.getElementById('selectionArea');

// Logic to add item from the Shop
function addItemToOrder(game, item) {
    createEntry(game, item);
    
    // Smooth scroll to the form
    document.getElementById('gifts').scrollIntoView({ behavior: 'smooth' });

    // Visual feedback
    const formSection = document.querySelector('.gifts-form');
    formSection.style.boxShadow = '0 0 20px rgba(124, 77, 255, 0.6)';
    setTimeout(() => { formSection.style.boxShadow = 'none'; }, 1000);
}

// Custom Item Button
document.getElementById('addItemBtn').addEventListener('click', () => {
    createEntry('', '');
});

// Helper function to create a Game + Item input pair
function createEntry(gameValue, itemValue) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'order-entry';
    entryDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group flex-1">
                <label>Game</label>
                <input type="text" class="gameInput" value="${gameValue}" placeholder="Game Name" required>
            </div>
            <div class="form-group flex-2">
                <label>Item</label>
                <input type="text" class="itemInput" value="${itemValue}" placeholder="Item Name" required>
            </div>
            <button type="button" class="remove-entry"><i class="fas fa-times"></i></button>
        </div>
    `;
    selectionArea.appendChild(entryDiv);

    entryDiv.querySelector('.remove-entry').addEventListener('click', () => {
        entryDiv.remove();
    });
}

// Initial empty entry if none selected
window.addEventListener('load', () => {
    if (selectionArea.children.length === 0) {
        // createEntry('', ''); // Uncomment if you want an empty field by default
    }
});

// Form Submission
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const entries = document.querySelectorAll('.order-entry');
    if (entries.length === 0) {
        alert('Please select at least one item.');
        return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const contact = document.getElementById('contactInfo').value;
    const notes = document.getElementById('message').value;
    
    let orderSummary = "";
    entries.forEach(entry => {
        const g = entry.querySelector('.gameInput').value;
        const i = entry.querySelector('.itemInput').value;
        orderSummary += `[${g}: ${i}] `;
    });

    const payload = {
        _subject: `📦 New EasyBux Multi-Order`,
        Customer: contact,
        Details: orderSummary,
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
            openModal();
            this.reset();
            selectionArea.innerHTML = '';
        } else {
            alert('Error sending. Check if FormSubmit is active.');
        }
    } catch (err) {
        console.error(err);
        alert('Connection failure.');
    } finally {
        submitBtn.innerText = 'Send Order Request';
        submitBtn.disabled = false;
    }
});

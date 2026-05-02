// Modal Logic
const modal = document.getElementById("successModal");

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Add More Items Logic
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.getElementById('addItemBtn');

addItemBtn.addEventListener('click', () => {
    const newItemEntry = document.createElement('div');
    newItemEntry.className = 'form-group item-entry';
    newItemEntry.innerHTML = `
        <label>Item Name *</label>
        <input type="text" class="itemName" placeholder="e.g. Dark Blade, VIP Gamepass" required>
        <button type="button" class="remove-item" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem; margin-top:5px;">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    itemsContainer.appendChild(newItemEntry);

    newItemEntry.querySelector('.remove-item').addEventListener('click', () => {
        newItemEntry.remove();
    });
});

// Form Submission Logic
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const contactInfo = document.getElementById('contactInfo').value;
    const gameName = document.getElementById('gameName').value;
    const message = document.getElementById('message').value;
    
    const itemElements = document.querySelectorAll('.itemName');
    let itemsList = [];
    itemElements.forEach(el => {
        if(el.value) itemsList.push(el.value);
    });

    const itemsString = itemsList.join(', ');

    const payload = {
        contact_info: contactInfo,
        game_name: gameName,
        items: itemsString,
        additional_notes: message
    };

    try {
        // Envia os dados para o seu servidor Python (Backend folder)
        // O servidor deve estar rodando em http://localhost:5000
        const response = await fetch('http://localhost:5000/api/send-gift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            openModal();
            this.reset();
            // Reset items container to one input
            itemsContainer.innerHTML = `
                <div class="form-group item-entry">
                    <label>Item Name *</label>
                    <input type="text" class="itemName" placeholder="e.g. Dark Blade, VIP Gamepass" required>
                </div>
            `;
        } else {
            alert('Error sending request: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the backend server. Please make sure /backend/server.py is running!');
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

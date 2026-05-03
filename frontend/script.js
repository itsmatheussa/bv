// ... (mantenha a lógica do modal e de adicionar itens igual ao original)

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

    // --- CORREÇÃO AQUI: URL COMPLETA DO ENDPOINT ---
    const BACKEND_URL = 'https://bv3.onrender.com'; 

    try {
        const response = await fetch(BACKEND_URL, {
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
            itemsContainer.innerHTML = `
                <div class="form-group item-entry">
                    <label>Item Name *</label>
                    <input type="text" class="itemName" placeholder="e.g. Dark Blade, VIP Gamepass" required>
                </div>
            `;
        } else {
            alert('Erro ao enviar pedido: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando no Render.');
    }
});

// ... (mantenha o Smooth scroll igual)

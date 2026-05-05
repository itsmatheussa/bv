
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

// Auto-select item logic
function selectItem(game, item) {
    document.getElementById('gameName').value = game;
    const itemInputs = document.querySelectorAll('.itemName');
    itemInputs[0].value = item;
    
    // Smooth scroll to form
    document.getElementById('gifts').scrollIntoView({ behavior: 'smooth' });
    
    // Visual feedback
    const form = document.querySelector('.gifts-form');
    form.style.boxShadow = '0 0 20px rgba(124, 77, 255, 0.6)';
    setTimeout(() => { form.style.boxShadow = 'none'; }, 1000);
}

// Add More Items Logic
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.getElementById('addItemBtn');

addItemBtn.addEventListener('click', () => {
    const newItemEntry = document.createElement('div');
    newItemEntry.className = 'form-group item-entry';
    newItemEntry.style.marginTop = '10px';
    newItemEntry.innerHTML = `
        <label>Item Extra *</label>
        <input type="text" class="itemName" placeholder="Nome do item" required>
        <button type="button" class="remove-item" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem; margin-top:5px;">
            <i class="fas fa-trash"></i> Remover
        </button>
    `;
    itemsContainer.appendChild(newItemEntry);

    newItemEntry.querySelector('.remove-item').addEventListener('click', () => {
        newItemEntry.remove();
    });
});

// Form Submission Logic (FormSubmit Hybrid Approach)
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Processando...';
    submitBtn.disabled = true;

    const contactInfo = document.getElementById('contactInfo').value;
    const gameName = document.getElementById('gameName').value;
    const message = document.getElementById('message').value;
    
    const itemElements = document.querySelectorAll('.itemName');
    let itemsList = [];
    itemElements.forEach(el => {
        if(el.value) itemsList.push(el.value);
    });

    const payload = {
        _subject: `📦 Novo Pedido EasyBux: ${gameName}`,
        Cliente: contactInfo,
        Jogo: gameName,
        Itens: itemsList.join(', '),
        Notas: message || "Sem observações",
        _template: "table",
        _captcha: "false" // Desativa captcha para facilitar
    };

    // USANDO FORMSUBMIT (SUBSTITUA PELO SEU EMAIL)
    const FORM_URL = 'https://formsubmit.co/ajax/ang3lagency@gmail.com'; 

    try {
        const response = await fetch(FORM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            openModal();
            this.reset();
            // Reseta container de itens extras se houver
            itemsContainer.innerHTML = `
                <div class="form-group item-entry">
                    <label>Itens Desejados *</label>
                    <input type="text" class="itemName" placeholder="Ex: Dark Blade" required>
                </div>
            `;
        } else {
            alert('Ocorreu um erro ao enviar. Tente novamente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        submitBtn.innerText = 'Enviar Pedido e Gerar Link';
        submitBtn.disabled = false;
    }
});


// Modal logic
const modal = document.getElementById("successModal");
function openModal() { modal.style.display = "block"; }
function closeModal() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

// Item selection logic
function selectItem(game, item) {
    document.getElementById('gameName').value = game;
    // Get all inputs with class itemName
    const itemInputs = document.querySelectorAll('.itemName');
    // Set the value of the FIRST item input
    itemInputs[0].value = item;
    
    // Smooth scroll to the form section
    document.getElementById('gifts').scrollIntoView({ behavior: 'smooth' });

    // Little animation to show it was selected
    const formSection = document.querySelector('.gifts-form');
    formSection.style.transform = 'scale(1.02)';
    setTimeout(() => { formSection.style.transform = 'scale(1)'; }, 300);
}

// Dynamic item addition
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.getElementById('addItemBtn');

addItemBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'form-group item-entry';
    div.innerHTML = `
        <label>Item Extra *</label>
        <input type="text" class="itemName" placeholder="Nome do item" required>
        <button type="button" class="remove-item" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem; margin-top:5px;">
            <i class="fas fa-trash"></i> Remover
        </button>
    `;
    itemsContainer.appendChild(div);
    div.querySelector('.remove-item').addEventListener('click', () => div.remove());
});

// Form Submission (FormSubmit Hybrid)
document.getElementById('giftForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;

    const contact = document.getElementById('contactInfo').value;
    const game = document.getElementById('gameName').value;
    const notes = document.getElementById('message').value;
    
    const itemInputs = document.querySelectorAll('.itemName');
    let items = [];
    itemInputs.forEach(input => { if(input.value) items.push(input.value); });

    const payload = {
        _subject: `🎁 Novo Pedido EasyBux: ${game}`,
        Cliente: contact,
        Jogo: game,
        Itens: items.join(', '),
        Observacoes: notes || "Nenhuma",
        _captcha: "false"
    };

    // FORMURL - Replace with your activated email if needed
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
            // Reset to only one item field
            itemsContainer.innerHTML = `
                <div class="form-group item-entry">
                    <label>Itens Desejados *</label>
                    <input type="text" class="itemName" placeholder="Ex: Dark Blade" required>
                </div>
            `;
        } else {
            alert('Erro ao enviar. Verifique se o seu email do FormSubmit está ativado.');
        }
    } catch (err) {
        console.error(err);
        alert('Falha na conexão.');
    } finally {
        submitBtn.innerText = 'Enviar Pedido';
        submitBtn.disabled = false;
    }
});

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
# Configuração robusta de CORS para aceitar requisições de qualquer origem
CORS(app, resources={r"/api/*": {"origins": "*"}})

GMAIL_USER = os.environ.get('GMAIL_USER', 'ang3lagency@gmail.com')
GMAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD')

# ROTA DE TESTE: Acesse https://bv3.onrender.com/ para ver se o servidor acordou
@app.route('/')
def health_check():
    return "Servidor da EasyBux está ONLINE!", 200

@app.route('/api/send-gift', methods=['POST', 'OPTIONS'])
def send_gift():
    # Se for uma requisição de pré-verificação (OPTIONS), responde ok imediatamente
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    try:
        if not GMAIL_PASSWORD:
            return jsonify({"status": "error", "message": "GMAIL_PASSWORD não configurada"}), 500

        data = request.json
        contact = data.get('contact_info')
        game = data.get('game_name')
        items = data.get('items')
        notes = data.get('additional_notes', 'None')

        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER 
        msg['Subject'] = f"New Gift Request: {game}"
        
        body = f"Contato: {contact}\nJogo: {game}\nItens: {items}\nNotas: {notes}"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        return jsonify({"status": "success", "message": "Pedido enviado!"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

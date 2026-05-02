from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app) # Permite que o frontend (na pasta /frontend) acesse este backend

# GMAIL CONFIGURATION
GMAIL_USER = 'ang3lagency@gmail.com'
# IMPORTANT: Generate an "App Password" in Google settings.
GMAIL_PASSWORD = 'mxmx wmze lxaa dorf' 

@app.route('/api/send-gift', methods=['POST']) # Adicionado /api/ para padrão de backend
def send_gift():
    try:
        data = request.json
        contact = data.get('contact_info')
        game = data.get('game_name')
        items = data.get('items')
        notes = data.get('additional_notes', 'None')

        # Email Body
        subject = f"New Gift Request: {game}"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #7c4dff;">New Gift Request Received!</h2>
                <hr>
                <p><strong>Contact (Discord/Email):</strong> {contact}</p>
                <p><strong>Game Name:</strong> {game}</p>
                <p><strong>Requested Items:</strong> {items}</p>
                <p><strong>Additional Notes:</strong> {notes}</p>
                <br>
                <p style="font-size: 0.8em; color: #888;">This message was automatically sent via the EasyBux Website Backend.</p>
            </body>
        </html>
        """

        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER 
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        # SMTP Connection
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        return jsonify({"status": "success", "message": "Email sent successfully"}), 200

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("EasyBux Backend is starting...")
    print("Listening on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)

# How to Configure Gmail for Direct Email Sending (EasyBux v3)

This guide explains how to set up your Gmail account and run the EasyBux website with its new **Frontend/Backend** separated structure.

## Project Structure:
```
easybux_v3/
├── frontend/             # Contains HTML, CSS, JS, and assets
│   ├── assets/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/              # Contains the Python Flask server
    └── server.py
└── GMAIL_SETUP.md        # This guide
```

## 1. Create an "App Password" (REQUIRED)
Google does not allow apps to use your main password for security reasons. You must generate a specific 16-character password for the script.

1.  Go to your **Google Account settings** ([https://myaccount.google.com/](https://myaccount.google.com/)).
2.  Select **Security** on the left menu.
3.  Under "How you sign in to Google," make sure **2-Step Verification** is ON.
4.  Click on **2-Step Verification** -> Scroll to the bottom and click **App passwords**.
5.  In the "Select app" dropdown, choose **Other (Custom name)** and type "EasyBux Server".
6.  Click **Generate**.
7.  **Copy the 16-character code** displayed in the yellow box.

## 2. Update `backend/server.py`
Open the `server.py` file located in the `backend/` folder and replace the placeholder:

```python
GMAIL_USER = 'ang3lagency@gmail.com'
GMAIL_PASSWORD = 'PASTE_YOUR_16_CHAR_CODE_HERE'
```

## 3. How to Run the Website with the Email Server

### Step A: Install Backend Dependencies
You need Python and Flask installed. Navigate to the `backend` folder in your terminal and run:
```bash
cd easybux_v3/backend
pip install flask flask-cors
```

### Step B: Start the Backend Server
While still in the `backend` folder, run the Python script:
```bash
python server.py
```
*Keep this terminal window open and running. The server will listen on `http://localhost:5000`.*

### Step C: Open the Frontend Website
Open the `index.html` file located in the `frontend/` folder in your web browser.

Now, when someone submits the form on the website, the frontend (`script.js`) will send a request to your running backend server (`server.py`), which will then send the email to `ang3lagency@gmail.com`!

---
**Manus AI** - 2026

import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from dotenv import load_dotenv  # Import the loader

# Load the variables from .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

db = SQLAlchemy(app)
mail = Mail(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    level = db.Column(db.Integer, default=1)

# --- ROUTES ---
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login')) # This was failing because 'login' didn't exist
    user = User.query.get(session['user_id'])
    return render_template('index.html', level=user.level)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Simple check: find user or create them (for easy testing)
        user = User.query.filter_by(username=username).first()
        
        if not user:
            # If user doesn't exist, we create them automatically for this project
            user = User(username=username, password=password)
            db.session.add(user)
            db.session.commit()
        
        if user.password == password:
            session['user_id'] = user.id
            return redirect(url_for('index'))
            
    return render_template('login.html')

@app.route('/update_level', methods=['POST'])
def update_level():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        user.level += 1
        db.session.commit()
        return jsonify({"status": "success", "new_level": user.level})
    return jsonify({"status": "error"}), 401

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/force_level_50')
def force_level_50():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        user.level = 50  # Sets your level to the max
        db.session.commit()
        return "<h1>Hack Successful!</h1><p>You are now Level 50. Refresh your game and check your email!</p>"
    return "Please login first!"
@app.route('/claim_certificate', methods=['POST'])
def claim_certificate():
    data = request.json
    full_name = data.get('name')
    target_email = data.get('email')

    if not full_name or not target_email:
        return jsonify({"status": "error", "message": "Missing details"}), 400

    try:
        msg = Message("OFFICIAL SADU TYPING CERTIFICATE",
                      sender=app.config['MAIL_USERNAME'],
                      recipients=[target_email])
        
        # You can make this much more "gaming" style with HTML
        msg.body = f"""
        RANK: ELITE TYPIST
        --------------------------
        This certifies that {full_name} has successfully 
        completed all 50 Levels of the SADU Typing Interface.
        
        Status: Verified
        Level: 50 / 50
        --------------------------
        """
        mail.send(msg)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

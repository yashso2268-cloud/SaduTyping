import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

# --- CONFIGURATION ---
# Use a relative path for SQLite to ensure it works on the cloud
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

db = SQLAlchemy(app)
mail = Mail(app)

# --- DATABASE MODEL ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    level = db.Column(db.Integer, default=1)

# --- ROUTES ---
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    return render_template('index.html', level=user.level)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if not user:
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
        
        msg.body = f"RANK: ELITE TYPIST\n\nThis certifies that {full_name} has completed SADU Typing."
        mail.send(msg)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# --- INITIALIZATION ---
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

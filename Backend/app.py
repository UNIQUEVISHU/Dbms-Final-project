from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)

# ✅ CORS FIX (final)
CORS(app)

# CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///learncircle.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ✅ FORCE HEADERS (important)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

# ✅ OPTIONS HANDLER (preflight fix)
@app.route('/api/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return '', 200

# ================= ROOT =================
@app.route('/')
def home():
    return "Backend is running 🚀"

# ================= MODELS =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")
    points = db.Column(db.Integer, default=0)
    reputation_level = db.Column(db.Integer, default=1)


class Circle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    tags = db.Column(db.String(500))
    creator_id = db.Column(db.Integer)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=True)
    circle_id = db.Column(db.Integer)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    user_id = db.Column(db.Integer)
    circle_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ================= AUTH =================

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("REGISTER DATA:", data)

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'Missing fields'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username exists'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email exists'}), 400

        user = User(
            username=username,
            email=email,
            password=generate_password_hash(password)
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Registered successfully'}), 201

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        user = User.query.filter_by(username=data.get('username')).first()

        if user and check_password_hash(user.password, data.get('password')):
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'points': user.points,
                'reputation_level': user.reputation_level
            })

        return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({'error': str(e)}), 500

# ================= PROFILE =================

@app.route('/api/users/<int:user_id>/profile', methods=['GET'])
def get_profile(user_id):
    user = User.query.get_or_404(user_id)

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'points': user.points,
        'reputation_level': user.reputation_level
    })

# ================= CIRCLES =================

@app.route('/api/circles', methods=['GET', 'POST'])
def circles():
    try:
        if request.method == 'POST':
            data = request.get_json()

            circle = Circle(
                title=data.get('title'),
                description=data.get('description'),
                tags=data.get('tags', ''),
                creator_id=data.get('creator_id')
            )

            db.session.add(circle)
            db.session.commit()

            return jsonify({'message': 'Circle created'})

        circles = Circle.query.all()

        result = []
        for c in circles:
            creator = User.query.get(c.creator_id)
            result.append({
                'id': c.id,
                'title': c.title,
                'description': c.description,
                'tags': c.tags,
                'creator_name': creator.username if creator else "Unknown"
            })

        return jsonify(result)

    except Exception as e:
        print("CIRCLES ERROR:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/circles/<int:id>', methods=['GET'])
def get_circle(id):
    c = Circle.query.get_or_404(id)

    return jsonify({
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'tags': c.tags
    })

# ================= TASKS =================

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()

        due = data.get('due_date')
        parsed_date = datetime.fromisoformat(due) if due else None

        task = Task(
            title=data.get('title'),
            description=data.get('description'),
            due_date=parsed_date,
            circle_id=data.get('circle_id')
        )

        db.session.add(task)
        db.session.commit()

        return jsonify({'message': 'Task added'})

    except Exception as e:
        print("TASK ERROR:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/circles/<int:id>/tasks')
def get_tasks(id):
    tasks = Task.query.filter_by(circle_id=id).all()

    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'due_date': t.due_date.isoformat() if t.due_date else None
    } for t in tasks])

# ================= CHAT =================

@app.route('/api/circles/<int:id>/messages', methods=['GET', 'POST'])
def messages(id):
    try:
        if request.method == 'POST':
            data = request.get_json()

            msg = Message(
                text=data.get('text'),
                user_id=data.get('user_id'),
                circle_id=id
            )

            db.session.add(msg)
            db.session.commit()

            return jsonify({'message': 'Sent'})

        msgs = Message.query.filter_by(circle_id=id).all()

        result = []
        for m in msgs:
            user = User.query.get(m.user_id)
            result.append({
                'id': m.id,
                'text': m.text,
                'user_id': m.user_id,
                'username': user.username if user else "User",
                'timestamp': m.timestamp.isoformat()
            })

        return jsonify(result)

    except Exception as e:
        print("CHAT ERROR:", e)
        return jsonify({'error': str(e)}), 500

# ================= RUN =================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)
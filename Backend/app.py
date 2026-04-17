from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///learncircle.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ================= CORS FIX =================
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

@app.route('/api/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return '', 200

# ================= ROOT =================
@app.route('/')
def home():
    return "Backend running 🚀"

# ================= MODELS (9 TABLES) =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20), default="student")
    points = db.Column(db.Integer, default=0)
    reputation_level = db.Column(db.Integer, default=1)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)


class Circle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer)


class CircleMember(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    circle_id = db.Column(db.Integer)


class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    circle_id = db.Column(db.Integer)
    creator_id = db.Column(db.Integer)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    circle_id = db.Column(db.Integer)


class TaskCompletion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    user_id = db.Column(db.Integer)
    resource_id = db.Column(db.Integer)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    user_id = db.Column(db.Integer)
    circle_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class PointsHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    points = db.Column(db.Integer)
    reason = db.Column(db.String(200))


# ================= AUTH =================

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Registered successfully'})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(username=data['username']).first()

    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'points': user.points,
            'reputation_level': user.reputation_level
        })

    return jsonify({'error': 'Invalid credentials'}), 401


# ================= PROFILE =================

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = User.query.get_or_404(user_id)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "points": user.points
    })


# ================= CIRCLES =================

@app.route('/api/circles', methods=['GET', 'POST'])
def circles():
    if request.method == 'POST':
        data = request.get_json()

        circle = Circle(
            title=data['title'],
            description=data['description'],
            creator_id=data['creator_id']
        )

        db.session.add(circle)
        db.session.commit()

        return jsonify({'message': 'Circle created'})

    circles = Circle.query.all()

    return jsonify([{
        "id": c.id,
        "title": c.title,
        "description": c.description
    } for c in circles])


# ================= TASKS =================

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    task = Task(
        title=data['title'],
        description=data['description'],
        circle_id=data['circle_id']
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({'message': 'Task added'})


@app.route('/api/circles/<int:id>/tasks')
def get_tasks(id):
    tasks = Task.query.filter_by(circle_id=id).all()

    return jsonify([{
        "id": t.id,
        "title": t.title
    } for t in tasks])


# ================= CHAT =================

@app.route('/api/circles/<int:id>/messages', methods=['GET', 'POST'])
def messages(id):
    if request.method == 'POST':
        data = request.get_json()

        msg = Message(
            text=data['text'],
            user_id=data['user_id'],
            circle_id=id
        )

        db.session.add(msg)
        db.session.commit()

        return jsonify({'message': 'Sent'})

    msgs = Message.query.filter_by(circle_id=id).all()

    return jsonify([{
        "text": m.text,
        "user_id": m.user_id
    } for m in msgs])


# ================= SEED DATA =================

def seed_data():
    if User.query.first():
        return

    names = ["mayank", "yatika", "vishu", "aditya", "aryan", "rahul", "rohit", "karan", "sneha", "priya"]

    users = []
    for n in names:
        users.append(User(
            username=n,
            email=f"{n}@gmail.com",
            password=generate_password_hash("123")
        ))

    db.session.add_all(users)
    db.session.commit()

    for i in range(1, 11):
        db.session.add(Circle(
            title=f"{['React', 'Design', 'AI', 'System', 'Product'][i%5]} Circle {i}",
            description="Learning group",
            creator_id=1
        ))

    db.session.commit()

    for i in range(1, 11):
        db.session.add(Task(
            title=f"Task {i}",
            description="Complete this task",
            circle_id=(i % 10) + 1
        ))

    for i in range(1, 11):
        db.session.add(Message(
            text=f"Message {i}",
            user_id=(i % 10) + 1,
            circle_id=(i % 10) + 1
        ))

    db.session.commit()


# ================= RUN =================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data()

    app.run(debug=True)

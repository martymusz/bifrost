import hashlib
from app.models import db


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'bifrost'}

    userid = db.Column(db.Integer, db.Sequence('seq_user'), primary_key=True, index=True)
    email = db.Column(db.String(64), unique=True, index=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(64), nullable=False)
    role = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    def to_dict(self):
        return {
            'userid': self.userid,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'active': self.active
        }

    @staticmethod
    def add_new_user(email, password, name, role):
        new_user = User(email=email, password=hashlib.md5(password.encode()).hexdigest(), name=name, role=role,
                        active=True)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def verify_password(self, password):
        return hashlib.md5(password.encode()).hexdigest() == self.password

    def change_password(self, password):
        self.password = hashlib.md5(password.encode()).hexdigest()
        db.session.commit()
        return self

    @staticmethod
    def get_by_email(email):
        user = User.query.filter_by(email=email)[0]
        return user

    @staticmethod
    def get_by_userid(userid):
        user = User.query.filter_by(userid=userid)[0]
        return user

    def disable_account(self):
        self.active = False
        db.session.commit()
        return self

    def enable_account(self):
        self.active = True
        db.session.commit()
        return self

    def change_role(self, role):
        self.role = role
        db.session.commit()
        return self

    @staticmethod
    def remove_user(userid):
        user = User.query.filter_by(userid=userid)[0]
        if user:
            db.session.delete(user)
            db.session.commit()

    @staticmethod
    def login(email, password):
        user = User.get_by_email(email=email)
        if not user or not user.verify_password(password):
            return
        return user

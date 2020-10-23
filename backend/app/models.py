#pip install flask-sqlalchemy
#pip install flask-migrate

from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(64), index=True, unique=True)
  password_hash = db.Column(db.String(128))
  nome = db.Column(db.String(128))
  data_nascimento = db.Column(db.DateTime())
  estado = db.Column(db.String(64), index=True)
  cidade = db.Column(db.String(64), index=True)
  profissao = db.Column(db.String(64), index=True)

  def __repr__(self):
    return '<User email: ' + self.email + '>'

  def set_password(self, password):
    self.password_hash = generate_password_hash(password)
    return
  
  def check_password(self, password):
    return check_password_hash(self.password_hash, password)

  @classmethod
  def register(cls, email, password):
    new_user = cls(email=email, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()

  @classmethod
  def update_data(cls, email, nome, data_nascimento, estado, cidade, profissao):
    db.session.query(User).filter(User.email==email).update({User.nome: nome, User.data_nascimento: data_nascimento, User.estado: estado, User.cidade: cidade, User.profissao: profissao})
    db.session.commit()
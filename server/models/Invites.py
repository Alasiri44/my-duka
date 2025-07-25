from . import db, SerializerMixin
from datetime import datetime

class Invite(db.Model, SerializerMixin):
    __tablename__ = 'invites'

    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=True)
    email = db.Column(db.String, nullable=False, unique=True)
    role = db.Column(db.String, nullable=False)
    token = db.Column(db.String, unique=True, nullable=False)
    is_accepted = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    business = db.relationship('Business')
    store = db.relationship('Store')
    serialize_rules = ('-business', '-store')

    def __repr__(self):
        return f'<Invite {self.email} for {self.role}>'

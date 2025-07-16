from . import db, SerializerMixin
from datetime import datetime

class Merchant(db.Model, SerializerMixin):
    __tablename__ = 'merchants'
    
    id = db.Column(db.Integer, primary_key=True )
    first_name= db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String)
    password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    businesses = db.relationship('Business', back_populates='merchant', cascade='all, delete-orphan')
    serialize_rules = ('-businesses.merchant',)
    
    def __repr__(self):
        return f'<Merchant {self.id}: {self.first_name} {self.last_name} using {self.email}>'
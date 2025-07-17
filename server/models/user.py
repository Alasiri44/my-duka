from . import db, SerializerMixin
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True )
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    first_name= db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String)
    phone_number = db.Column(db.String, nullable=True)
    gender = db.Column(db.String, nullable=True)
    role = db.Column(db.String, nullable=False)
    is_active = db.Column(db.Boolean)
    clerk_category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    store = db.relationship('Store', back_populates='users')
    clerk_category = db.relationship('Category', back_populates='clerks')
    serialize_rules = ('-store.users', '-clerk_category.clerks', )
    
    def __repr__(self):
        return f'<user {self.id}: {self.first_name} {self.last_name} using {self.email}>'
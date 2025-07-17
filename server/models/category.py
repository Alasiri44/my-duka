from . import db, SerializerMixin
from datetime import datetime

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True )
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'))
    name= db.Column(db.String)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    business = db.relationship('Business', back_populates='categories')
    clerks = db.relationship('User', back_populates='clerk_category', cascade='all, delete-orphan')
    products = db.relationship('Product', back_populates='category', cascade='all, delete-orphan')
    serialize_only = ('id', 'business_id', 'name', 'description', 'business.name')
    
    def __repr__(self):
        return f'<category {self.id}: {self.name} {self.description}>'
from . import db, SerializerMixin
from datetime import datetime

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True )
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'))    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String)
    selling_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    business = db.relationship('Business', back_populates='products')
    category = db.relationship('Category', back_populates='products')
    supply_requests = db.relationship('Supply_Request', back_populates='product',)
    serialize_only = ('id', 'store_id', 'category_id', 'name', 'description', 'quantity', 'selling_price', 'created_at', 'updated_at', 'store.name', 'category.name')
    
    def __repr__(self):
        return f'<product {self.id}: {self.name}, {self.description}>'
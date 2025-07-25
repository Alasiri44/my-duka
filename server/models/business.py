from . import db, SerializerMixin
from datetime import datetime

class Business(db.Model, SerializerMixin):
    __tablename__ = 'businesses'
    
    id = db.Column(db.Integer, primary_key=True)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'))
    name = db.Column(db.String)
    country = db.Column(db.String)
    po_box = db.Column(db.String, nullable=True)
    postal_code = db.Column(db.String, nullable=True)
    county = db.Column(db.String, nullable=True)
    location = db.Column(db.String, nullable=True)
    industry = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    products = db.relationship("Product", back_populates="business", cascade="all, delete-orphan")
    merchant = db.relationship('Merchant', back_populates='businesses')
    stores = db.relationship('Store', back_populates='business', cascade='all, delete-orphan')
    categories = db.relationship('Category', back_populates='business', cascade='all, delete-orphan')
    business_setting = db.relationship('Business_Setting', back_populates='business')
    suppliers = db.relationship('Supplier', back_populates='business', cascade= 'all, delete-orphan')
    serialize_only = (
        'id', 'merchant_id', 'name', 'country', 'po_box', 'postal_code',
        'county', 'location', 'industry', 'created_at'
    )
    
    def __repr__(self):
        return f'<Business {self.id}: {self.name} at {self.location} >'
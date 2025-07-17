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
    industry = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    merchant = db.relationship('Merchant', back_populates='businesses')
    stores = db.relationship('Store', back_populates='business', cascade='all, delete-orphan')
    serialize_rules = ('-merchant.businesses', '-merchant.password_hash')
    
    def __repr__(self):
        return f'<Business {self.id}: {self.name} at {self.address} >'
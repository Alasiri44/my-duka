from . import db, SerializerMixin
from datetime import datetime

class Supplier(db.Model, SerializerMixin):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True )
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'))
    name = db.Column(db.String)
    contact_name = db.Column(db.String)
    email = db.Column(db.String, unique = True)
    phone_number = db.Column(db.String, nullable=True)
    paybill_number = db.Column(db.String, nullable=True)
    till_number = db.Column(db.String, nullable = True)
    country = db.Column(db.String)
    po_box = db.Column(db.String, nullable=True)
    postal_code = db.Column(db.String, nullable=True)
    county = db.Column(db.String, nullable=True)
    location = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    business = db.relationship('Business', back_populates='suppliers')
    supply_requests = db.relationship('Supply_Request', back_populates='supplier')
    stock_entries = db.relationship('Stock_Entry', back_populates='supplier' )
    serialize_rules = ('-business.suppliers', '-business.categories', '-business.stores', '-business.merchant')
    serialize_only = ( 'id','business_id','name','contact_name','email','phone_number','paybill_number','till_number','location','country','county','po_box','postal_code','created_at',)
    
    def __repr__(self):
        return f'<Supplier {self.id}: {self.name }, {self.contact_name} using {self.email}>'
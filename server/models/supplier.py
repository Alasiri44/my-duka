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
    serialize_rules = ('-business.suppliers', '-business.categories', '-business.stores', '-business.merchant')
    
    def __repr__(self):
        return f'<Supplier {self.id}: {self.name }, {self.contact_name} using {self.email}>'
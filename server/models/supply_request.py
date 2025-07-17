from . import db, SerializerMixin
from datetime import datetime

class Supply_Request(db.Model, SerializerMixin):
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True )
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    requested_by = db.Column(db.String)
    quantity = db.Column(db.String, unique = True)
    status = db.Column(db.String, nullable=True)
    reviewed_by = db.Column(db.String,nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    reviewed_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    product = db.relationship('Product', back_populates='supply_requests')
    supplier = db.relationship('Supplier', back_populates='supply_requests')
    reviewer = db.relationship('User', back_populates='supply_requests')
    serialize_rules = ('-business.supply_requests', '-supplier.supply_requests')
    
    def __repr__(self):
        return f'<supply_request {self.id}: {self.name }, {self.contact_name} using {self.email}>'
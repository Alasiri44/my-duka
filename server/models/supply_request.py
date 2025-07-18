from . import db, SerializerMixin
from datetime import datetime

class Supply_Request(db.Model, SerializerMixin):
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True )
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    quantity = db.Column(db.String, unique = True)
    status = db.Column(db.String, nullable=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    reviewed_at = db.Column(db.DateTime)
    
    product = db.relationship('Product', back_populates='supply_requests')
    supplier = db.relationship('Supplier', back_populates='supply_requests')
    requester = db.relationship('User', back_populates='requests_made', foreign_keys=[requester_id])
    reviewer = db.relationship('User', back_populates='requests_reviewed', foreign_keys=[reviewer_id])
    serialize_rules = ('-business.supply_requests', '-supplier.supply_requests')
    
    #Validation to fill the reviewed_at during review
    @property
    def reviewer_id(self):
        return self.reviewer_id
    
    @reviewer_id.setter
    def reviewer_id(self, value):
        self.reviewer_id = value
        if value is not None:
            self.reviewed_at = datetime.now()
    
    def __repr__(self):
        return f'<supply_request {self.id}: {self.name }, {self.contact_name} using {self.email}>'
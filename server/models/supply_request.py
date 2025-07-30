from . import db, SerializerMixin
from datetime import datetime
from sqlalchemy.orm import validates

class Supply_Request(db.Model, SerializerMixin):
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True )
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'))
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    quantity = db.Column(db.Integer)
    status = db.Column(db.String, nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    
    product = db.relationship('Product', back_populates='supply_requests')
    supplier = db.relationship('Supplier', back_populates='supply_requests')
    requester = db.relationship('User', back_populates='requests_made', foreign_keys=[requester_id])
    reviewer = db.relationship('User', back_populates='requests_reviewed', foreign_keys=[reviewer_id])
    stock_entries = db.relationship('Stock_Entry', back_populates = 'supply_request')
    # serialize_rules = ('-product.supply_requests', '-supplier.supply_requests', '-requester.requests_made', '-reviewer.requests_made',)
    serialize_only = ('id', 'product_id', 'supplier_id', 'created_at', 'reviewed_at', 'requester_id', 'quantity', 'status', 'reviewer_id', 'requester.first_name', 'reviewer.first_name')
    
    #Validation to fill the reviewed_at during review
     # Automatically set reviewed_at when reviewer_id is set
    @validates('reviewer_id')
    def set_reviewed_at(self, key, value):
        if value is not None:
            self.reviewed_at = datetime.now()
        return value
    
    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "supplier_id": self.supplier_id,
            "requester_id": self.requester_id,
            "requester_first_name": self.requester.first_name if self.requester else None,
            "requester_last_name": self.requester.last_name if self.requester else None,
            "reviewer_id": self.reviewer_id,
            "reviewer_first_name": self.reviewer.first_name if self.reviewer else None,
            "reviewer_last_name": self.reviewer.last_name if self.reviewer else None,
            "quantity": self.quantity,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
        }
    
    def __repr__(self):
        return f'<supply_request {self.id}: {self.name }, {self.contact_name} using {self.email}>'
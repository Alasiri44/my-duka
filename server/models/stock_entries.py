from . import db, SerializerMixin
from datetime import datetime

class Stock_Entry(db.Model, SerializerMixin):
    __tablename__ = 'stock_entries'
    
    id = db.Column(db.Integer, primary_key=True )
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    clerk_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    batch_id = db.Column(db.Integer, db.ForeignKey('batches.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    supply_request_id = db.Column(db.Integer, db.ForeignKey('supply_requests.id') ,nullable=True)
    quantity_received = db.Column(db.Integer)
    spoilt = db.Column(db.Integer, default=0)
    buying_price = db.Column(db.Numeric(10, 2))
    payment_status = db.Column(db.String)
    payment_method = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    store = db.relationship('Store', back_populates='stock_entries')
    product = db.relationship('Product')
    batch = db.relationship('Batch', back_populates='stock_entries')
    clerk = db.relationship('User', back_populates='stock_entries')
    supplier = db.relationship('Supplier', back_populates='stock_entries')
    payments = db.relationship('Payment', back_populates='stock_entry')
    supply_request = db.relationship('Supply_Request', back_populates = 'stock_entries')
    serialize_rules = ('-clerk.stock_entries', '-supplier.stock_entries', '-supply_request.stock_entries')
    
    def __repr__(self):
        return f'<Stock_entry {self.id}: {self.product_id}>'
from . import db, SerializerMixin
from datetime import datetime

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'
    
    id = db.Column(db.Integer, primary_key=True )
    business_id= db.Column(db.Integer, db.ForeignKey('businesses.id'))
    name = db.Column(db.String)
    country = db.Column(db.String)
    po_box = db.Column(db.String, nullable=True)
    postal_code = db.Column(db.String, nullable=True)
    location = db.Column(db.String, nullable=True)
    county = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    stock_entries = db.relationship('Stock_Entry', back_populates='store')
    business = db.relationship('Business', back_populates='stores')
    users = db.relationship('User', back_populates='store', cascade='all, delete-orphan')
    batches = db.relationship('Batch', back_populates='store')
    products = db.relationship('Product', back_populates='store')
    stock_exits = db.relationship('StockExit', back_populates='store')

    serialize_rules = ('-business.stores', '-users.store', '-products.store', '-batches.store')
    serialize_only = ('id', 'name', 'location', 'business_id', 'created_at')  # ✅ add this line

    
    def __repr__(self):
        return f'<Merchant {self.id}: {self.name} at {self.county}>'
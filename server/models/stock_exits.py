from . import db, SerializerMixin
from datetime import datetime

class StockExit(db.Model, SerializerMixin):
    __tablename__ = 'stock_exits'

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    recorded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    batch_id = db.Column(db.Integer, db.ForeignKey('batches.id'), nullable=False)

    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=True)  # NEW
    quantity = db.Column(db.Integer, nullable=False)
    selling_price = db.Column(db.Numeric(10, 2), nullable=False)
    reason = db.Column(db.String, nullable=False)  # 'sold', 'expired', 'damaged'
    created_at = db.Column(db.DateTime, default=datetime.now)

    store = db.relationship('Store')
    product = db.relationship('Product')
    user = db.relationship('User')
    batch = db.relationship('Batch')
    sale = db.relationship('Sale', back_populates='stock_exits')  # NEW

    serialize_only = (
        'id', 'store_id', 'product_id', 'recorded_by', 'batch_id',
        'quantity', 'selling_price', 'reason', 'created_at', 'sale_id'
    )

    def __repr__(self):
        return f'<StockExit {self.id} - Product {self.product_id} - Qty {self.quantity}>'


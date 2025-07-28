from . import db, SerializerMixin
from datetime import datetime

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    recorded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    payment_method = db.Column(db.String, nullable=False)  # 'Cash', 'MPesa', 'Card', etc.
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    customer_name = db.Column(db.String, nullable=True)
    customer_contact = db.Column(db.String, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    store = db.relationship('Store')
    user = db.relationship('User')
    stock_exits = db.relationship('StockExit', back_populates='sale')

    payments = db.relationship('Payment', back_populates='sale')
    stock_exits = db.relationship('StockExit', back_populates='sale', cascade='all, delete-orphan')

    serialize_only = (
        'id', 'store_id', 'recorded_by', 'payment_method',
        'total_amount', 'customer_name', 'customer_contact',
        'notes', 'created_at'
    )

    def __repr__(self):
        return f'<Sale {self.id} - Store {self.store_id} - KES {self.total_amount}>'

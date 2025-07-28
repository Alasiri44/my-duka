from . import db, SerializerMixin
from datetime import datetime

class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    direction = db.Column(db.String, nullable=False)  # 'incoming' or 'outgoing'
    method = db.Column(db.String, nullable=False)     # 'mpesa', 'cash', 'card'
    amount = db.Column(db.Numeric(10, 2), nullable=False)

    mpesa_receipt_number = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True)
    transaction_date = db.Column(db.DateTime, nullable=True)

    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=True)
    stock_entry_id = db.Column(db.Integer, db.ForeignKey('stock_entries.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    sale = db.relationship('Sale', back_populates='payments')
    stock_entry = db.relationship('Stock_Entry', back_populates='payments')

    serialize_only = (
        'id',
        'direction',
        'method',
        'amount',
        'mpesa_receipt_number',
        'phone_number',
        'transaction_date',
        'sale_id',
        'stock_entry_id',
        'created_at',
    )

from . import db, SerializerMixin
from datetime import datetime

class Batch(db.Model, SerializerMixin):
    __tablename__ = 'batches'
    
    id = db.Column(db.Integer, primary_key=True )
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    direction= db.Column(db.String)
    party = db.Column(db.String)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    store = db.relationship('Store', back_populates='batches')
    creator = db.relationship('User', back_populates='batches')
    serialize_only = ('id', 'store_id', 'direction', 'party', 'created_by')
    
    def __repr__(self):
        return f'<batch {self.id}: {self.store_id}>'
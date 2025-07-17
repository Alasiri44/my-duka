from . import db, SerializerMixin
from datetime import datetime

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True )
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'))
    name= db.Column(db.String)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    business = db.relationship('Business', back_populates='categories')
    serialize_rules = ('-business.category',)
    
    def __repr__(self):
        return f'<category {self.id}: {self.name} {self.description}>'
from . import db, SerializerMixin
from datetime import datetime

class Business_Setting(db.Model, SerializerMixin):
    __tablename__ = 'business_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('businesses.id'))
    business_email = db.Column(db.String, unique=True, nullable=False)
    business_phone = db.Column(db.String, unique=True, nullable=False)
    use_daraja = db.Column(db.Boolean)
    daraja_short_code = db.Column(db.String)
    daraja_consumer_key = db.Column(db.String, nullable=True)
    daraja_consumer_secret = db.Column(db.String, nullable=True)
    daraja_passkey = db.Column(db.String, nullable=True)
    daraja_environment = db.Column(db.String, nullable=True)
    branding_logo_url = db.Column(db.Text)
    brand_color = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    business = db.relationship('Business', back_populates='business_setting')
    serialize_rules = ('-business.business_setting')
    
    def __repr__(self):
        return f'<Business_setting {self.id}: {self.business_email} using {self.business_phone} >'
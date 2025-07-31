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
    initiator_name = db.Column(db.String, nullable=True)
    security_credential = db.Column(db.String, nullable=True)
    base_url = db.Column(db.String, default="https://sandbox.safaricom.co.ke")
    callback_url = db.Column(db.String, nullable=True)
    result_url = db.Column(db.String, nullable=True)
    timeout_url = db.Column(db.String, nullable=True)
    c2b_confirm_url = db.Column(db.String, nullable=True)
    c2b_validate_url = db.Column(db.String, nullable=True)
    branding_logo_url = db.Column(db.Text)
    brand_color = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    business = db.relationship('Business', back_populates='business_setting')
    serialize_only = (
    'id', 'business_id', 'business_email', 'business_phone',
    'use_daraja', 'daraja_short_code', 'daraja_consumer_key',
    'daraja_consumer_secret', 'daraja_passkey', 'daraja_environment',
    'initiator_name', 'security_credential', 'base_url',
    'callback_url', 'result_url', 'timeout_url',
    'c2b_confirm_url', 'c2b_validate_url',
    'branding_logo_url', 'brand_color', 'created_at'
)    
    
    def __repr__(self):
        return f'<Business_setting {self.id}: {self.business_email} using {self.business_phone} >'
from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.product import Product
from models.category import Category
from models import db

product_bp = Blueprint('product_bp', __name__)
product_api = Api(product_bp)

class Products(Resource):
    def get(self):
        response = [product.to_dict() for product in Product.query.all()]
        return make_response(response, 200)

    def post(self):
        data = request.get_json() if request.is_json else request.form
        new_product = Product(
            name=data.get('name'),
            store_id=data.get('store_id'),
            category_id=data.get('category_id'),
            description=data.get('description'),
            selling_price=data.get('selling_price'),
            quantity=data.get('quantity') or 1
        )
        db.session.add(new_product)
        db.session.commit()
        return make_response(new_product.to_dict(), 201)

product_api.add_resource(Products, '/product')

class Product_By_ID(Resource):
    def get(self, id):
        product = Product.query.filter(Product.id == id).first()
        if product:
            return make_response(product.to_dict(), 200)
        else:
            return make_response({"message": "The product does not exist"}, 404)

    def patch(self, id):
        product = Product.query.filter(Product.id == id).first()
        if product:
            data = request.get_json() if request.is_json else request.form
            for attr in data:
                setattr(product, attr, data.get(attr))
            db.session.commit()
            return make_response(product.to_dict(), 200)
        else:
            return make_response({"message": "The product does not exist"}, 404)

    def delete(self, id):
        product = Product.query.filter(Product.id == id).first()
        if product:
            db.session.delete(product)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The product does not exist"}, 404)

product_api.add_resource(Product_By_ID, '/product/<int:id>')

class Product_By_StoreID(Resource):
    def get(self, id):
        response = [product.to_dict() for product in Product.query.filter(Product.store_id == id).all()]
        return make_response(response, 200)

product_api.add_resource(Product_By_StoreID, '/product/store/<int:id>')

class Product_By_CategoryID(Resource):
    def get(self, id):
        response = [product.to_dict() for product in Product.query.filter(Product.category_id == id).all()]
        return make_response(response, 200)

product_api.add_resource(Product_By_CategoryID, '/product/category/<int:id>')

class Product_In_Store_By_CategoryID(Resource):
    def post(self, id):
        data = request.get_json() if request.is_json else request.form
        category = data.get('category')
        response = [product.to_dict() for product in Product.query.join(Category).filter((Product.store_id == id) & (Category.name == category)).all()]
        return make_response(response, 200)

product_api.add_resource(Product_In_Store_By_CategoryID, '/product/store_category/<int:id>')
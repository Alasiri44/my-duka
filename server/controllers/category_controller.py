from flask_restful import Api, Resource
from flask import make_response, Blueprint, request
from models.category import Category
from models import db

category_bp = Blueprint('category_bp', __name__)
category_api = Api(category_bp)

class Categories(Resource):
    def get(self):
        response = [category.to_dict() for category in Category.query.all()]
        return make_response(response, 200)
    def post(self):
        data = request.form
        new_category = Category(
            name = data.get('name'),
            business_id = data.get('business_id'),
            description = data.get('description'),
        )
        if(new_category):
            db.session.add(new_category)
            db.session.commit()
            return make_response(new_category.to_dict(), 201)
        else:
            return make_response({"message": "Failed to create the category"}, 404)
        
category_api.add_resource(Categories, '/category')

class category_By_ID(Resource):
    def get(self, id):
        response = Category.query.filter(Category.id == id).first()
        if(response):
            return make_response(response.to_dict(), 200)
        else:
            return make_response({"message": "The category does not exist"}, 404)
    def patch(self, id):
        category = Category.query.filter(Category.id == id).first()
        if(category):
            for attr in request.form:
                setattr(category, attr, request.form.get(attr))
            db.session.add(category)
            db.session.commit()
            return make_response(category.to_dict(), 200)
        else:
                return make_response({"message": "The category does not exist"}, 404)
    def delete(self, id):
        response = Category.query.filter(Category.id == id).first()
        if(response):
            db.session.delete(response)
            db.session.commit()
            return make_response('', 204)
        else:
            return make_response({"message": "The category does not exist"}, 404)
category_api.add_resource(category_By_ID, '/category/<id>')
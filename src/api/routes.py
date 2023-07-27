"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Terms
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/terms', methods=['GET'])
def get_all_terms():
    terms = Terms.query.all() #en términos obtenemos todos los términos de la bd
    data = [term.serialize() for term in terms] #para cada término lo serializamos (razón: no podemos hacer serialize a una lista de objetos, sino a un objeto)
    return jsonify(data)

@api.route('/terms', methods=['POST'])
def add_term():
    body = request.json #permitiendo extraer la info de los datos que envía user
    new_term = Terms(term = body["term"], definition= body["definition"]) #creamos nuevo término a partir de lo que envía el user
    db.session.add(new_term) #decir que se va a añadir a la tabla
    db.session.commit() #añadir la info a la tabla
    return jsonify({"msg": "new term added succesfully"})
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
    return jsonify(data), 200

@api.route('/terms', methods=['POST'])
def add_term():
    body = request.json #permitiendo extraer la info de los datos que envía user
    new_term = Terms(term = body["term"], definition= body["definition"]) #creamos nuevo término a partir de lo que envía el user
    db.session.add(new_term) #decir que se va a añadir a la tabla
    db.session.commit() #añadir la info a la tabla
    return jsonify({"msg": "new term added succesfully"}), 200

@api.route('terms/<term>', methods=['GET'])
def get_one_term(term):
    data = Terms.query.filter_by(term = term).first()
    return jsonify(data.serialize()), 200 #aquí sí podemos decirle que nos devuelva el serialize directamente porque nos está devolviendo un sólo término

@api.route('terms/<string:name>', methods=['DELETE'])
def delete_individual_term(name): 
    term = Terms.query.filter_by(term = name).first()
    db.session.delete(term)
    db.session.commit()
    return jsonify({"msg": "término eliminado con éxito"}), 200
    
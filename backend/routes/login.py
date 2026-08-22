from flask import Blueprint, render_template, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (create_access_token,
                                JWTManager, jwt_required,
                                get_jwt_identity)
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

login_db = Blueprint("login", __name__)

# proj_cartao2 o unico que recebe autenciacao
def banco_de_dados():
    return mysql.connector.connect(
        host='localhost',
        use='root',
        database='proj_cartao2',
        password='12345678'
    )

@login_db.route("/")
def login():
    return render_template("login.html")

@login_db.route('/criar_usuario', methods=['POST'])
def criar_usuario():
    dados = request.get_json()
    user = dados.get('user')
    senha = dados.get('senha')

    print("\n\n\n", user, senha)

    return jsonify({user:user, senha:senha})



if __name__ == "__main__":
    app.run(debug=True, port=5000)
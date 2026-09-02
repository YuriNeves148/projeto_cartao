from flask import Flask, Blueprint, render_template, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (create_access_token,
                                JWTManager, jwt_required,
                                get_jwt_identity)
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import os


login_db = Blueprint("login", __name__)

# proj_cartao2 o unico que recebe autenciacao
def banco_de_dados():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
    )

@login_db.route("/")
def login():
    return render_template("login.html")

@login_db.route('/criar_usuario', methods=['POST'])
def criar_usuario():
    dados = request.get_json()
    user = dados.get('user')
    senha = dados.get('senha')

    conexao = banco_de_dados()
    cursor = conexao.cursor()

    # verifica se ja existe user
    cursor.execute("SELECT username FROM usuario WHERE %s", (user,))
    encontra_user = cursor.fetchone()
    if encontra_user is not None:
        print('Usuario nao existe')
        return jsonify({"mensagem":"Usuário já cadastrado"})

    # cria usuaruio se nao existir
    senha_hash = generate_password_hash(senha)
    try:
        cursor.execute("INSERT INTO usuario (username, senha) VALUES (%s, %s)", (user, senha_hash))
        conexao.commit()
        return jsonify({"mensagem": "Usuário criado com sucesso!"})
    finally:
        cursor.close()
        conexao.close()

@login_db.route('/login', methods=['POST'])
def login_user():
    dados = request.get_json()
    user = dados.get('user')
    senha = dados.get('senha')

    conexao = banco_de_dados()
    cursor = conexao.cursor()

    # # verifica a existencia do user e se os dados estao corretos
    cursor.execute("SELECT * FROM usuario WHERE username = %s", (user,))
    encontra_user = cursor.fetchone()

    if not encontra_user:
        return jsonify({"erro":"Usuário ou senha incorretos!"})
    if not check_password_hash(encontra_user[2], senha):
        return ({"mensagem":"Usuário ou senha incorretos!"})

    # recupera o id do usuario para posteriormente realizar o login (o banco pede o id_usuario)
    cursor.execute("SELECT id_usuario FROM usuario WHERE username = %s", (user,))
    id_usuario = cursor.fetchone()

    # cria token
    token_acesso = create_access_token(identity=str(id_usuario[0]))

    return jsonify({"mensagem":"login realizado com sucesso!", "access_token":token_acesso, "id_usuario":id_usuario[0]}), 200


@login_db.route('/perfil', methods=['GET'])
@jwt_required()
def perfil():
    usuario_atual = get_jwt_identity()

    conexao = banco_de_dados()
    cursor = conexao.cursor()

    cursor.execute("SELECT username FROM usuario WHERE id_usuario = %s", (usuario_atual,))
    usuario = cursor.fetchone()[0]

    cursor.close()
    conexao.close()

    return jsonify({"mensagem":"Usuário logado", "user":usuario})

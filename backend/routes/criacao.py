from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint
from mysql.connector.errors import IntegrityError

criacao_bp = Blueprint("criacao", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="proj_cartao4",
        password="12345678"
    )

# área CRIAÇÃO
@criacao_bp.route("/criacao/adicionar/pessoa", methods=["POST"])
def adiciona_pessoa():
    dado = request.get_json()
    nome = dado.get("nome")
    
    conexao = conecta_banco()
    cursor = conexao.cursor()   

    cursor.execute("SELECT nome FROM pessoa WHERE nome = %s", (nome,))
    encontra_nome = cursor.fetchone()

    if encontra_nome is not None:
        return jsonify({"erro":"Nome de pessoa já existente."}), 500

    cursor.execute("INSERT INTO pessoa (nome) VALUES (%s)", (nome,))
    conexao.commit()
        
    cursor.close()
    conexao.close()
    
    return jsonify({"nome":nome})

@criacao_bp.route("/criacao/adicionar/banco", methods=["POST"])
def adiciona_banco():
    dado = request.get_json()
    nome = dado.get("nome")
    #print("\n\n\nnome: ", nome)
    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("SELECT nome FROM banco WHERE nome = %s", (nome,))
    encontra_nome = cursor.fetchone()

    if encontra_nome is not None:
        return jsonify({"erro":"Nome do banco já existente."}), 500
    
    cursor.execute("INSERT INTO banco (nome) VALUES (%s)", (nome,))
    conexao.commit()
    
    cursor.close()
    conexao.close()
    
    linhasAfetadas = cursor.rowcount

    if (linhasAfetadas == 0):
        return jsonify({"erro": "erro ao adicionar banco"})
    
    return jsonify(nome)
    
@criacao_bp.route("/criacao/adicionar/loja", methods=["POST"])
def adiciona_loja():
    dado = request.get_json()
    nome = dado.get("nome")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("SELECT nome FROM lojasite WHERE nome = %s", (nome,))
    encontra_nome = cursor.fetchone()

    if encontra_nome is not None:
        return jsonify({"erro":"Nome da lojao ou site já existente."}), 500

    cursor.execute("INSERT INTO lojasite (nome) VALUES (%s)", (nome,))
    conexao.commit()

    linhasAfetadas = cursor.rowcount

    cursor.close()
    conexao.close()

    if linhasAfetadas == 0:
        return jsonify({"erro":"nao foi possivel inserir nome."})
    
    return jsonify(nome)

@criacao_bp.route("/criacao/lista_pessoa")
def lista_pessoa():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM pessoa")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@criacao_bp.route("/criacao/lista_banco")
def lista_banco():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM banco")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@criacao_bp.route("/criacao/lista_loja")
def lista_loja():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM lojasite")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@criacao_bp.route("/criacao/excluir_pessoa", methods=["DELETE"])
def excluir_pessoa():
    dado = request.get_json()
    nome = dado.get("pessoa")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    # verifica se existe esse nome e se sim, pega o id_pessoa
    cursor.execute("SELECT id_pessoa FROM pessoa WHERE nome = %s", (nome,))
    encontra_id_pessoa = cursor.fetchone()
    if encontra_id_pessoa is None:
        return jsonify({"erro" : "Pessoa não encontrada.\nTente selecioná-la na lista."}), 404

    cursor.execute("DELETE FROM pessoa WHERE id_pessoa = %s", (encontra_id_pessoa[0],))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify(nome)

@criacao_bp.route("/criacao/excluir_loja", methods=["DELETE"])
def excluir_loja():
    dado = request.get_json()
    nome = dado.get("nome")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    # verfica se loja existe
    cursor.execute("SELECT nome FROM lojasite WHERE nome = %s", (nome,))
    encontra_nome_lojasite = cursor.fetchone()
    if encontra_nome_lojasite is None:
        return jsonify({"erro" : "Loja ou site não encontrado.\nTente selecioná-lo na lista."}), 404
    
    cursor.execute("DELETE FROM lojasite WHERE nome = %s", (encontra_nome_lojasite[0],))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify(nome), 200

@criacao_bp.route("/criacao/excluir_banco", methods=["DELETE"])
def excluir_banco():
    dado = request.get_json()
    nome = dado.get("nome")

    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    # verfica se banco existe
    cursor.execute("SELECT nome FROM banco WHERE nome = %s", (nome,))
    encontra = cursor.fetchone()
    if encontra is None:
        return jsonify({"erro" : "Nome do banco não encontrado"}), 404
    
    cursor.execute("DELETE FROM banco WHERE nome = %s", (nome,))
    conexao.commit()

    cursor.close()
    conexao.close()

    print(encontra)

    return jsonify({"sucesso":"Banco excluído com sucesso"}), 200

@criacao_bp.route("/criacao/edita_pessoa", methods=["PUT"])
def editar_pessoa():
    dados = request.get_json()
    nome = dados.get("nome_novo")
    id = dados.get("id_original")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    # verifica se o nome já existe
    cursor.execute("SELECT nome FROM pessoa WHERE nome = %s", (nome,))
    encontra_nome = cursor.fetchone()
    if encontra_nome is not None:
        return jsonify({"erro":"Nome já cadastrado na lista."}), 404

    cursor.execute("UPDATE pessoa SET nome = %s WHERE id_pessoa = %s", (nome, id))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"sucesso" : f"nome atualizado para: '{nome}'"})

@criacao_bp.route("/criacao/edita_banco", methods=["PUT"])
def editar_banco():
    dados = request.get_json()
    nome = dados.get("nome_novo")
    id = dados.get("id_original")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("SELECT nome FROM pessoa WHERE nome = %s", (nome,))
    verfica_nome = cursor.fetchone()

    if verfica_nome is not None:
        return jsonify({"erro" : "Nome do banco já cadastrado."}), 404

    cursor.execute("UPDATE banco SET nome = %s WHERE id_banco = %s", (nome, id)), 200
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"sucesso" : f"nome atualizado para: '{nome}'"})

@criacao_bp.route("/criacao/edita_loja", methods=["PUT"])
def editar_loja():
    dados = request.get_json()
    nome = dados.get("nome_novo")
    id = dados.get("id_original")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("SELECT nome FROM lojasite WHERE nome = %s", (nome,))
    verfica_nome = cursor.fetchone()

    if verfica_nome is not None:
        return jsonify({"erro" : "Nome da loja ou site já cadastrado."}), 404

    cursor.execute("UPDATE lojasite SET nome = %s WHERE id_lojasite = %s", (nome, id))
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"sucesso" : f"nome da loja/site atualizado para: '{nome}'"})



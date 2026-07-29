from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint

fatura_db = Blueprint("fatura", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="proj_cartao4",
        password="12345678"
    )

# área FATURA
@fatura_db.route("/fatura/lista_nubank")
def lista_fatura_nubank():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)
    try:
        # fatura mes 10
        sql = "SELECT pessoa.nome AS nome, lojasite.nome AS onde, parcela.data_vencimento AS fatura_mes, " \
        "(compra.qtd_parcela - parcela.numero_parcela + 1) AS parc_faltante, " \
        "parcela.valor_parcela FROM compra JOIN pessoa ON pessoa.id_pessoa = compra.id_pessoa " \
        "JOIN lojasite ON lojasite.id_lojasite = compra.id_lojasite " \
        "JOIN parcela ON parcela.id_compra = compra.id_compra " \
        "JOIN banco on banco.id_banco = compra.id_banco " \
        "WHERE parcela.data_vencimento >= '2028-06-01' AND parcela.data_vencimento <= '2028-10-31' " \
        "and banco.nome = 'nubank';"
        cursor.execute(sql)
        fatura = cursor.fetchall()
        #print(fatura)
    except Exception as e :
        return jsonify({"erro": str(e)})
    
    cursor.close()
    conexao.close()

    return jsonify(fatura)

@fatura_db.route("/fatura/lista_c6")
def lista_fatura_c6():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)
    try:
        # fatura mes 10
        sql = "SELECT pessoa.nome AS nome, lojasite.nome AS onde, parcela.data_vencimento AS fatura_mes, " \
        "(compra.qtd_parcela - parcela.numero_parcela + 1) AS parc_faltante, " \
        "parcela.valor_parcela FROM compra JOIN pessoa ON pessoa.id_pessoa = compra.id_pessoa " \
        "JOIN lojasite ON lojasite.id_lojasite = compra.id_lojasite " \
        "JOIN parcela ON parcela.id_compra = compra.id_compra " \
        "JOIN banco on banco.id_banco = compra.id_banco " \
        "WHERE parcela.data_vencimento >= '2028-06-01' AND parcela.data_vencimento <= '2028-10-31' " \
        "and banco.nome = 'c6';"

        cursor.execute(sql)
        fatura = cursor.fetchall()
        #print(fatura)
    except Exception as e :
        return jsonify({"erro": str(e)})
    
    cursor.close()
    conexao.close()

    return jsonify(fatura)

@fatura_db.route("/fatura/valor_nubank")
def valor_fatura_nubank():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    sql = "select SUM(valor_total/qtd_parcela) as fat_nu from " \
    "compra where id_banco = 1 and data_compra > '2028-01-01'"
    cursor.execute(sql)

    valor_nu = cursor.fetchone()
    #print(valor_nu)
    
    return jsonify({"valor":valor_nu})


if __name__ == "__main__":
    app.run(debug=True, port=5000)


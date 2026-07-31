from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint
from datetime import date
from dateutil.relativedelta import relativedelta

individual_db = Blueprint("individual", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="proj_cartao4",
        password="12345678"
    )

@individual_db.route("/individual/listas/")
def lista_ind_nubank():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)
    
    mes = request.args.get("mes")
    ano = request.args.get("ano", date.today().year)

    mes_sql = int(mes) + 1
    ano = int(ano)

    data_fim = date(ano, mes_sql, 17)

    sql_nu = "SELECT pessoa.nome AS nome_pessoa, SUM(compra.valor_total / compra.qtd_parcela) AS valor_parcela FROM compra JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa JOIN parcela ON compra.id_compra = parcela.id_compra JOIN banco ON compra.id_banco = banco.id_banco WHERE banco.nome = 'Nubank' AND parcela.data_vencimento = %s GROUP BY pessoa.id_pessoa, pessoa.nome;"
    sql_c6 = "SELECT pessoa.nome AS nome_pessoa, SUM(compra.valor_total / compra.qtd_parcela) AS valor_parcela FROM compra JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa JOIN parcela ON compra.id_compra = parcela.id_compra JOIN banco ON compra.id_banco = banco.id_banco WHERE banco.nome = 'C6' AND parcela.data_vencimento = %s GROUP BY pessoa.id_pessoa, pessoa.nome;"

    cursor.execute(sql_nu, (data_fim,))
    dado_nubank = cursor.fetchall()

    cursor.execute(sql_c6, (data_fim,))
    dado_c6 = cursor.fetchall()

    #print("fatura por pessoa NUBANK: ", dado_nubank)
    #print("fatura por pessoa C6: ", dado_c6)

    cursor.close()
    conexao.close()

    return jsonify(dado_nubank, dado_c6)

@individual_db.route("/individual/fatura/")
def fatura():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    mes = request.args.get("mes")
    ano = request.args.get("ano", date.today().year)

    mes = int(mes) + 1
    ano = int(ano)

    data_vencimento = date(ano, mes, 17)

    sql_nu = "select sum(compra.valor_total/compra.qtd_parcela) as valor_fatura_nubank " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'Nubank';"
    cursor.execute(sql_nu, (data_vencimento,))
    dados_nu = cursor.fetchall()

    sql_c6 = "select sum(compra.valor_total/compra.qtd_parcela) as valor_fatura_c6 " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'C6';"
    cursor.execute(sql_c6, (data_vencimento,))
    dados_c6 = cursor.fetchall()


    print("fatura nu: ", dados_nu)
    print("fatura c6: ", dados_c6)
    
    cursor.close()
    conexao.close()

    return jsonify({"nubank":dados_nu, "c6": dados_c6})

if __name__ == "__main__":
    app.run(debug=True, port=5000)


from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint
from datetime import date
from dateutil.relativedelta import relativedelta

home_bp = Blueprint("home", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="proj_cartao4",
        password="12345678"
    )

@home_bp.route("/home/lista_historico/")
def lista_historico():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    mes = request.args.get("mes")
    ano = request.args.get("ano", date.today().year)
    if mes is None:
        return jsonify({"erro":"selecione um mes para prosseguir"})

    mes_sql = int(mes) + 1
    ano = int(ano)
    # resolvendo problema de fatura
    data_fim = date(ano, mes_sql, 9)

    data_inicio = data_fim - relativedelta(months=1)
    data_inicio = data_inicio.replace(day=10)

    sql = "select pessoa.nome as nome_pessoa, banco.nome as nome_banco, " \
    "lojasite.nome as onde, compra.data_compra, valor_total, qtd_parcela, " \
    "(compra.valor_total / compra.qtd_parcela) as valor_parcela " \
    "from compra join pessoa on pessoa.id_pessoa = compra.id_pessoa " \
    "join banco on banco.id_banco = compra.id_banco " \
    "join lojasite on lojasite.id_lojasite = compra.id_lojasite " \
    "WHERE compra.data_compra BETWEEN %s AND %s " \
    "order by compra.id_compra asc;"

    cursor.execute(sql,(data_inicio, data_fim,))
    dado = cursor.fetchall()
    
    cursor.close()
    conexao.close()

    return jsonify(dado), 200    

@home_bp.route("/home/faturas")
def fatura_nubank():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    sql_nu = "select SUM(valor_total/qtd_parcela) as fat_nu from compra where id_banco = 1;"
    cursor.execute(sql_nu)
    fat_nu = cursor.fetchone()
    #print("FATURA NU:", fat_nu)

    sql_bb = "select SUM(valor_total/qtd_parcela) as fat_nu from compra where id_banco = 2;" #simulando os valores da C6
    cursor.execute(sql_bb)
    fat_bb = cursor.fetchone()
    #print("FATURA BB:", fat_bb)

    cursor.close()
    conexao.close()

    return jsonify({"fat_bb": fat_bb, "fat_nu": fat_nu})


if __name__ == "__main__":
    app.run(debug=True, port=5000)


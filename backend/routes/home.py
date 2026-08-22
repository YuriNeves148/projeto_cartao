from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint, render_template
from datetime import date
from dateutil.relativedelta import relativedelta
import os

home_bp = Blueprint("home", __name__)


def conecta_banco():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
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
    #print("mes escolhido: ",mes_sql)
    ano = int(ano)
    # resolvendo problema de fatura
    data_fim = date(ano, mes_sql, 17)
    
    #data_inicio = data_fim - relativedelta(months=1)
    #data_inicio = data_inicio.replace(day=10)
    #print(data_inicio)
    #print(data_fim)
    sql = "select compra.data_compra, pessoa.nome as pessoa, banco.nome as banco, compra.valor_total, " \
    "compra.qtd_parcela, (compra.valor_total/compra.qtd_parcela) as valor_parcela, lojasite.nome as lojasite, " \
    "parcela.numero_parcela as numero_parcela " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join pessoa on compra.id_pessoa = pessoa.id_pessoa " \
    "join banco on compra.id_banco = banco.id_banco " \
    "join lojasite on compra.id_lojasite = lojasite.id_lojasite " \
    "where parcela.data_vencimento = %s order by pessoa.nome;"
    

    cursor.execute(sql, (data_fim,))
    dado = cursor.fetchall()
    #print("DADOS: ",dado)
    cursor.close()
    conexao.close()

    return jsonify(dado), 200    

@home_bp.route("/home/faturas")
def faturas():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    mes = request.args.get("mes")
    ano = request.args.get("ano", date.today().year)
    if mes is None:
        return jsonify({"erro":"selecione um mes para prosseguir"})

    mes_sql = int(mes) + 1
    ano = int(ano)
    data_fim = date(ano, mes_sql, 17)

    # resolvendo problema de fatura
    #data_fim = date(ano, mes_sql, 17)
    #data_inicio = data_fim - relativedelta(months=1)
    #data_inicio = data_inicio.replace(day=10)

    # selecionando para NUBANK
    sql_nu = "select sum(compra.valor_total/compra.qtd_parcela) as valor_fatura_nubank " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'Nubank';"
    cursor.execute(sql_nu, (data_fim,))
    fatura_nu = cursor.fetchone()

    # selecionando para C6
    sql_bb = "select sum(compra.valor_total/compra.qtd_parcela) as valor_fatura_c6 " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'C6';"

    cursor.execute(sql_bb, (data_fim,))
    fatura_c6 = cursor.fetchone()

    #print("FATURA NUBANK:", fatura_nu)
    #print("FATURA C6:", fatura_c6)

    cursor.close()
    conexao.close()

    return jsonify({"nubank": fatura_nu, "c6": fatura_c6})



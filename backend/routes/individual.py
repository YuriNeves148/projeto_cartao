from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint
from datetime import date
from dateutil.relativedelta import relativedelta
import os

individual_db = Blueprint("individual", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
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

    sql_nu = "SELECT pessoa.nome AS nome_pessoa, " \
    "SUM(compra.valor_total / compra.qtd_parcela) AS valor_parcela " \
    "FROM compra JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa " \
    "JOIN parcela ON compra.id_compra = parcela.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE banco.nome = 'Nubank' AND parcela.data_vencimento = %s " \
    "GROUP BY pessoa.id_pessoa, pessoa.nome;"
    
    sql_c6 = "SELECT pessoa.nome AS nome_pessoa, " \
    "SUM(compra.valor_total / compra.qtd_parcela) AS valor_parcela " \
    "FROM compra JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa " \
    "JOIN parcela ON compra.id_compra = parcela.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE banco.nome = 'C6' AND parcela.data_vencimento = %s " \
    "GROUP BY pessoa.id_pessoa, pessoa.nome;"

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
    data_final = date(ano, mes, 9)

    if mes == 1:
        data_inicio = date(ano - 1, 12, 10)
    else:
        data_inicio = date(ano, mes - 1, 10)
    data_vencimento = date(ano, mes, 17)

    sql_nu = "SELECT COALESCE(SUM(compra.valor_total/compra.qtd_parcela), 0) AS total_compras, " \
    "COALESCE((SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra AS compra_reembolso ON reembolso.id_compra = compra_reembolso.id_compra " \
    "JOIN banco AS banco_reembolso ON compra_reembolso.id_banco = banco_reembolso.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco_reembolso.nome = 'Nubank'), 0) AS total_reembolso, " \
    "COALESCE(SUM(compra.valor_total/compra.qtd_parcela), 0) - " \
    "COALESCE((SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra AS compra_reembolso ON reembolso.id_compra = compra_reembolso.id_compra " \
    "JOIN banco AS banco_reembolso ON compra_reembolso.id_banco = banco_reembolso.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco_reembolso.nome = 'Nubank'), 0) AS valor_fatura_nubank " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'Nubank';"
    cursor.execute(sql_nu, (data_inicio, data_final, data_inicio, data_final, data_vencimento))
    dados_nu = cursor.fetchall()

    sql_c6 = "SELECT COALESCE(SUM(compra.valor_total/compra.qtd_parcela), 0) AS total_compras, " \
    "COALESCE((SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra AS compra_reembolso ON reembolso.id_compra = compra_reembolso.id_compra " \
    "JOIN banco AS banco_reembolso ON compra_reembolso.id_banco = banco_reembolso.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco_reembolso.nome = 'C6'), 0) AS total_reembolso, " \
    "COALESCE(SUM(compra.valor_total/compra.qtd_parcela), 0) - " \
    "COALESCE((SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra AS compra_reembolso ON reembolso.id_compra = compra_reembolso.id_compra " \
    "JOIN banco AS banco_reembolso ON compra_reembolso.id_banco = banco_reembolso.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco_reembolso.nome = 'C6'), 0) AS valor_fatura_c6 " \
    "from compra " \
    "join parcela on compra.id_compra = parcela.id_compra " \
    "join banco on compra.id_banco = banco.id_banco " \
    "where parcela.data_vencimento = %s " \
    "and banco.nome = 'C6';"
    cursor.execute(sql_c6, (data_inicio, data_final, data_inicio, data_final, data_vencimento))
    dados_c6 = cursor.fetchall()

    #print("fatura nu: ", dados_nu)
    #print("fatura c6: ", dados_c6)
    
    cursor.close()
    conexao.close()

    return jsonify({"nubank":dados_nu, "c6": dados_c6})

@individual_db.route("/individual/reembolso/")
def reembolso():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)
    
    mes = request.args.get("mes")
    mes = int(mes) +1
    #print("\n\nmes da fatura: ", mes)
    ano = request.args.get("ano", date.today().year)
    ano = int(ano)

    # A fatura do mês selecionado fecha no dia 10. Portanto, ela reúne
    # reembolsos feitos do dia 10 do mês anterior até o dia 9 deste mês.
    data_final = date(ano, mes, 9)
    if mes == 1:
        data_inicio = date(ano - 1, 12, 10)
    else:
        data_inicio = date(ano, mes - 1, 10)
    data_vencimento = date(ano, mes, 17)   
    #print("\n\n\n")
    #print(data_inicio, data_final)

    """
    sql_c6 = "SELECT " \
    "COALESCE(( SELECT SUM(parcela.valor_parcela) " \
    "FROM parcela " \
    "JOIN compra ON parcela.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE parcela.data_vencimento " \
    "BETWEEN %s AND %s AND banco.nome = 'C6' ), 0) " \
    "AS total_fatura, " \
    "" \
    "COALESCE(( SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso " \
    "BETWEEN %s AND %s AND banco.nome = 'C6' ), 0) " \
    "AS total_reembolso, " \
    "" \
    "COALESCE(( SELECT SUM(parcela.valor_parcela) " \
    "FROM parcela " \
    "JOIN compra ON parcela.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE parcela.data_vencimento " \
    "BETWEEN %s AND %s AND banco.nome = 'C6' ), 0) - " \
    "" \
    "COALESCE(( SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s AND banco.nome = 'C6' ), 0) " \
    "AS valor_final;"
    cursor.execute(sql_c6, (data_inicio, data_final, data_inicio, data_final, data_inicio, data_final, data_inicio, data_final))
    resposta_c6 = cursor.fetchall()
    print("\n\n retorno fatura C6: ", resposta_c6[0])
    sql_nubank = "SELECT " \
    "COALESCE(( SELECT SUM(parcela.valor_parcela) " \
    "FROM parcela " \
    "JOIN compra ON parcela.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE parcela.data_vencimento " \
    "BETWEEN %s AND %s AND banco.nome = 'Nubank' ), 0) " \
    "AS total_fatura, " \
    "" \
    "COALESCE(( SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso " \
    "JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso " \
    "BETWEEN %s AND %s AND banco.nome = 'Nubank' ), 0) " \
    "AS total_reembolso, " \
    "" \
    "COALESCE(( SELECT SUM(parcela.valor_parcela) " \
    "FROM parcela " \
    "JOIN compra ON parcela.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE parcela.data_vencimento " \
    "BETWEEN %s AND %s AND banco.nome = 'Nubank' ), 0) - " \
    "" \
    "COALESCE(( SELECT SUM(reembolso.valor_reembolso) " \
    "FROM reembolso JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s AND banco.nome = 'Nubank' ), 0) " \
    "AS valor_final;"
    cursor.execute(sql_nubank, (data_inicio, data_final, data_inicio, data_final, data_inicio, data_final, data_inicio, data_final))
    resposta_nubank = cursor.fetchall()
    print("\n\n retorno fatura Nubank: ", resposta_nubank[0])
    """

    lista_nubank = "SELECT " \
    "compra.id_compra AS codigo_compra, " \
    "reembolso.data_reembolso, " \
    "pessoa.nome AS nome, " \
    "reembolso.valor_reembolso " \
    "FROM reembolso " \
    "JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco.nome = 'Nubank';"
    cursor.execute(lista_nubank, (data_inicio, data_final))
    retorno_nubank = cursor.fetchall()
    #print("\n\n retorno nubank: ", retorno_nubank)

    lista_c6 = "SELECT " \
    "compra.id_compra AS codigo_compra, " \
    "reembolso.data_reembolso, " \
    "pessoa.nome AS nome, " \
    "reembolso.valor_reembolso " \
    "FROM reembolso " \
    "JOIN compra ON reembolso.id_compra = compra.id_compra " \
    "JOIN pessoa ON compra.id_pessoa = pessoa.id_pessoa " \
    "JOIN banco ON compra.id_banco = banco.id_banco " \
    "WHERE reembolso.data_reembolso BETWEEN %s AND %s " \
    "AND banco.nome = 'C6';"
    cursor.execute(lista_c6, (data_inicio, data_final))
    retorno_c6 = cursor.fetchall()
    print("\n\n retorno c6: ", retorno_c6)

    cursor.close()
    conexao.close()

    return jsonify({"nubank":retorno_nubank, "c6": retorno_c6})



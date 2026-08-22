from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
import os
compra_bp = Blueprint("compra", __name__)

def conecta_banco():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
    )

# área COMPRA
@compra_bp.route("/compra/lista")
def lista_compra():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    sql = "select compra.id_compra, pessoa.nome as nome_pessoa, banco.nome as nome_banco, " \
    "lojasite.nome as onde, compra.data_compra, valor_total, qtd_parcela, " \
    "(compra.valor_total / compra.qtd_parcela) as valor_parcela " \
    "from compra join pessoa on pessoa.id_pessoa = compra.id_pessoa " \
    "join banco on banco.id_banco = compra.id_banco " \
    "join lojasite on lojasite.id_lojasite = compra.id_lojasite " \
    "order by compra.id_compra asc;"

    cursor.execute(sql)
    dados = cursor.fetchall()
    #print(dados)
    return jsonify(dados)

@compra_bp.route("/compra/salvar", methods=["POST"])
def salvar_compra():
    dados = request.get_json()
    codigo = dados.get("valor_codigo")
    data = dados.get("data_comp")
    nome = dados.get("nome_comp")
    banco = dados.get("banco_comp")
    loja = dados.get("loja_comp")
    valor_total = dados.get("valor_total_comp")
    qtd_parcela = dados.get("qtd_parcela_comp")

    conexao = conecta_banco()
    cursor = conexao.cursor(buffered=True)

    # verificando se compra já existe
    cursor.execute("SELECT id_compra FROM compra WHERE id_compra = %s", (codigo,))
    verifica_compra = cursor.fetchone()
    
    if verifica_compra is not None:
        print("\n\nNao salvar")
        return jsonify({"cliclou":"Essa compra já existe. Apague os inputs e tente novamente."})
    print("\n\nAcessa pessoa")
    # encontrando id do nome
    sql_id_nome = "SELECT id_pessoa FROM pessoa WHERE nome = %s"
    cursor.execute(sql_id_nome, (nome,))
    id_pessoa = cursor.fetchone()
    if id_pessoa is None:
        return jsonify({"mesma_compra":"A pessoa informada não está salva no banco de dados.\nVerifique a lista de pessoas em 'Área Criação'"})
    print("\n\nAcessa banco")
    # encontrando id do banco
    sql_id_banco = "SELECT id_banco FROM banco WHERE nome = %s"
    cursor.execute(sql_id_banco, (banco,))
    id_banco = cursor.fetchone()
    if id_banco is None:
        return jsonify({"erro":"O banco informado não está salvo no banco de dados.\nVerifique a lista de bancos em 'Área Criação'"})
    print("\n\nAcessa loja")
    # encontrando id da loja
    sql_id_loja = "SELECT id_lojasite FROM lojasite WHERE nome = %s"
    cursor.execute(sql_id_loja, (loja,))
    id_loja = cursor.fetchone()
    if id_loja is None:
        return jsonify({"erro":"A loja/site informada não está salva no banco de dados.\nVerifique a lista de loja/site em 'Área Criação'"})
    print("\n\n insere no banco")
    sql_salvar = "INSERT INTO compra " \
    "(id_pessoa, id_banco, id_lojasite, data_compra, valor_total, qtd_parcela) VALUES" \
    "(%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql_salvar, (id_pessoa[0], id_banco[0], id_loja[0], data, valor_total, qtd_parcela))
    print("Inserido")

    # gerando parcelas:
    id_compra = cursor.lastrowid
    gerador_parcela(
        cursor,
        id_compra,
        data,
        qtd_parcela,
        valor_total
    )    
    print("adicionou em parclea")
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"sucesso":"Compra adicionada!"}), 200

@compra_bp.route("/compra/excluir", methods=["DELETE"])
def exclui_compra():
    dados = request.get_json()
    codigo = dados.get("condigo_comp")
    
    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM parcela WHERE id_compra = %s", (codigo,))
    cursor.execute("DELETE FROM compra WHERE id_compra = %s", (codigo,))
    conexao.commit()

    return jsonify({"success":"Compra excluida com sucesso"}), 200

@compra_bp.route("/compra/verifica_input/<tipo>")
def buscar(tipo):
    print("tipo recebido: ", tipo)
    dado = request.args.get("q", "")
    print("digitado: ", dado)
    conexao = conecta_banco()
    cursor = conexao.cursor()

    if tipo == "pessoa":
        cursor.execute("SELECT nome FROM pessoa WHERE nome LIKE %s LIMIT 10", (f"%{dado}%",))
    elif tipo == "banco":
        cursor.execute("SELECT nome FROM banco WHERE nome LIKE %s LIMIT 10", (f"%{dado}%",))
    elif tipo == "loja":
        cursor.execute("SELECT nome FROM lojasite WHERE nome LIKE %s LIMIT 10", (f"%{dado}%",))

    else:
        return jsonify([]), 400

    resultado = [linha[0] for linha in cursor.fetchall()]
    print(resultado)
    cursor.close()
    conexao.close()

    return jsonify(resultado)
    
@compra_bp.route("/compra/reembolso", methods=["POST"])
def salvar_reembolso():
    # *duvida: e se a pessoa fizer varios pedidos de reembolso que excedam o valor total da compra? 
    # como evitar isso? Fazer apenas um pedido de reembolso por periodo de fatura?

    dados = request.get_json()
    id_compra = dados.get("codigo")
    valor_reembolso = dados.get("valor")
    data_reembolso = dados.get("data")  

    conexao = conecta_banco()
    cursor = conexao.cursor()

    sql = "INSERT INTO reembolso (id_compra, valor_reembolso, data_reembolso) " \
    "VALUES (%s, %s, %s)"
    cursor.execute(sql, (id_compra, valor_reembolso, data_reembolso))
    conexao.commit()
    
    cursor.close()
    conexao.close()

    return jsonify({"sucesso":"reembolso registrado!"}), 201

@compra_bp.route("/compra/edicao", methods=["PUT"])
def editar_compra():
    dados = request.get_json()

    id_compra = dados.get("id")
    data = dados.get("data")
    nome = dados.get("nome")
    banco = dados.get("banco")
    loja = dados.get("loja")
    valor_total = dados.get("valor_total")
    qtd_parcela = dados.get("qtd_parcela")

    conexao = conecta_banco()
    cursor = conexao.cursor(buffered=True)

    try:
        # procura pessoa
        cursor.execute(
            "SELECT id_pessoa FROM pessoa WHERE nome = %s",
            (nome,)
        )
        id_pessoa = cursor.fetchone()

        if id_pessoa is None:
            return jsonify({
                "erro": "A pessoa informada não está salva no banco de dados.\nVerifique a lista de pessoas em 'Área Criação'"
            })

        # procura banco
        cursor.execute(
            "SELECT id_banco FROM banco WHERE nome = %s",
            (banco,)
        )
        id_banco = cursor.fetchone()

        if id_banco is None:
            return jsonify({
                "erro": "O banco informado não está salvo no banco de dados.\nVerifique a lista de bancos em 'Área Criação'"
            })

        # procura loja
        cursor.execute(
            "SELECT id_lojasite FROM lojasite WHERE nome = %s",
            (loja,)
        )
        id_loja = cursor.fetchone()

        if id_loja is None:
            return jsonify({
                "erro": "A loja/site informada não está salva no banco de dados.\nVerifique a lista de loja/site em 'Área Criação'"
            })

        # atualiza compra
        sql = """
            UPDATE compra
            SET
                id_pessoa = %s,
                id_banco = %s,
                id_lojasite = %s,
                data_compra = %s,
                valor_total = %s,
                qtd_parcela = %s
            WHERE id_compra = %s
        """

        cursor.execute(sql, (
            id_pessoa[0],
            id_banco[0],
            id_loja[0],
            data,
            valor_total,
            qtd_parcela,
            id_compra
        ))

        # apaga as parcelas antigas
        cursor.execute(
            "DELETE FROM parcela WHERE id_compra = %s",
            (id_compra,)
        )

        # gera novamente as parcelas
        gerador_parcela(
            cursor,
            id_compra,
            data,
            qtd_parcela,
            valor_total
        )
        conexao.commit()

        return jsonify({
            "mensagem": "Compra editada com sucesso."
        })

    except Exception as erro:
        conexao.rollback()
        return jsonify({
            "erro": str(erro)
        }), 500

    finally:
        cursor.close()
        conexao.close()

# adicionando parcelas a cada compra
def gerador_parcela(cursor, id_compra, data_compra, qtd_parcela, valor_total):
    print("adicionando em parcela")
    qtd_parcela = int(qtd_parcela)
    data_compra = datetime.strptime(data_compra,"%Y-%m-%d").date()

    valor_parcela = round(float(valor_total) / qtd_parcela, 2)

    # se for
    if data_compra.day < 10: 
        primeira_parc = date(
            data_compra.year,
            data_compra.month,
            17
        )
    # compra feita depois do fechamento
    else:
        # se no final do ano
        if data_compra.month == 12:
            ano = data_compra.year + 1
            mes = 1
        else:
            ano = data_compra.year
            mes = data_compra.month + 1
    
        primeira_parc = date(ano, mes, 17)

    sql = "INSERT INTO parcela (id_compra, numero_parcela, valor_parcela, data_vencimento) VALUES (%s,%s,%s,%s)"

    for i in range(1, qtd_parcela+1):
        data_vencimento = primeira_parc + relativedelta(months=i - 1)
        cursor.execute(sql, (id_compra, i, valor_parcela, data_vencimento))
        print(i, data_vencimento)
    #print("\n\nparcelas gerada!")


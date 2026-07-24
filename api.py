from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def conecta_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        database="proj_cartao",
        password="12345678"
    )

@app.route("/home/lista_historico")
def lista_historico():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    sql = "select pessoa.nome as nome_pessoa, banco.nome as nome_banco, lojasite.nome as onde, " \
    "compra.data_compra, compra.valor_total, qtd_parcela, (compra.valor_total / compra.qtd_parcela) as valor_parcela " \
    "from compra join pessoa on pessoa.id_pessoa = compra.id_pessoa " \
    "join banco on compra.id_banco = banco.id_banco " \
    "join lojasite on compra.id_lojasite = lojasite.id_lojasite " \
    "join parcela on compra.id_compra = parcela.id_parcela order by data_compra asc;"

    cursor.execute(sql)
    dado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return jsonify(dado), 200    

@app.route("/home/faturas")
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

@app.route("/criacao/adicionar/pessoa", methods=["POST"])
def adiciona_pessoa():
    dado = request.get_json()
    nome = dado.get("nome")
    #print("NOME:", nome)
    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("INSERT INTO pessoa (nome) VALUES (%s)", (nome,))
    conexao.commit()

    cursor.close()
    conexao.close()
    
    return jsonify({"nome":nome})

@app.route("/criacao/adicionar/banco", methods=["POST"])
def adiciona_banco():
    dado = request.get_json()
    nome = dado.get("nome")
    #print("\n\n\nnome: ", nome)
    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("INSERT INTO banco (nome) VALUES (%s)", (nome,))
    conexao.commit()
    
    cursor.close()
    conexao.close()
    
    linhasAfetadas = cursor.rowcount

    if (linhasAfetadas == 0):
        return jsonify({"erro": "erro ao adicionar banco"})
    
    return jsonify(nome)
    
@app.route("/criacao/adicionar/loja", methods=["POST"])
def adiciona_loja():
    dado = request.get_json()
    nome = dado.get("nome")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("INSERT INTO lojasite (nome) VALUES (%s)", (nome,))
    conexao.commit()

    linhasAfetadas = cursor.rowcount

    cursor.close()
    conexao.close()

    if linhasAfetadas == 0:
        return jsonify({"erro":"nao foi possivel inserir nome."})
    
    return jsonify(nome)

@app.route("/criacao/lista_pessoa")
def lista_pessoa():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT nome FROM pessoa")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@app.route("/criacao/lista_banco")
def lista_banco():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT nome FROM banco")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@app.route("/criacao/lista_loja")
def lista_loja():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT nome FROM lojasite")
    dado = cursor.fetchall()
    #print(dado)
    cursor.close()
    conexao.close()

    return jsonify(dado)

@app.route("/compra/lista")
def lista_compra():
    conexao = conecta_banco()
    cursor = conexao.cursor(dictionary=True)

    sql = "select compra.id_compra, pessoa.nome as nome_pessoa, banco.nome as nome_banco, " \
    "lojasite.nome as onde, compra.data_compra, compra.valor_total, qtd_parcela, " \
    "(compra.valor_total / compra.qtd_parcela) as valor_parcela " \
    "from compra join pessoa on pessoa.id_pessoa = compra.id_pessoa " \
    "join banco on compra.id_banco = banco.id_banco " \
    "join lojasite on compra.id_lojasite = lojasite.id_lojasite " \
    "join parcela on compra.id_compra = parcela.id_parcela " \
    "group by compra.id_compra;"

    cursor.execute(sql)
    dados = cursor.fetchall()
    #print(dados)
    return jsonify(dados)

@app.route("/compra/salvar", methods=["POST"])
def salvar_compra():
    dados = request.get_json()
    data = dados.get("data_comp")
    nome = dados.get("nome_comp")
    banco = dados.get("banco_comp")
    loja = dados.get("loja_comp")
    valor_total = dados.get("valor_total_comp")
    qtd_parcela = dados.get("qtd_parcela_comp")

    conexao = conecta_banco()
    cursor = conexao.cursor()

    # encontrando id do nome
    sql_id_nome = "SELECT id_pessoa FROM pessoa WHERE nome = %s"
    cursor.execute(sql_id_nome, (nome,))
    id_pessoa = cursor.fetchone()[0]
    #print("nome pessoa: ", nome)
    #print("id pessoa: ", id_pessoa)

    # encontrando id do banco
    sql_id_banco = "SELECT id_banco FROM banco WHERE nome = %s"
    cursor.execute(sql_id_banco, (banco,))
    id_banco = cursor.fetchone()[0]
    #print("nome banco: ", banco)
    #print("id banco: ", id_banco)

    # encontrando id da loja
    sql_id_loja = "SELECT id_lojasite FROM lojasite WHERE nome = %s"
    cursor.execute(sql_id_loja, (loja,))
    id_loja = cursor.fetchone()[0]
    #print("nome loja: ", loja)
    #print("id loja: ", id_loja)

    sql_salvar = "INSERT INTO compra " \
    "(id_pessoa, id_banco, id_lojasite, data_compra, valor_total, qtd_parcela) VALUES" \
    "(%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql_salvar, (id_pessoa, id_banco, id_loja, data, valor_total, qtd_parcela))
    conexao.commit()

    print("valores salvos")
    
    cursor.close()
    conexao.close()

    return jsonify(success=True, message="Compra adicionada!"), 200

@app.route("/compra/excluir", methods=["DELETE"])
def exclui_compra():
    dados = request.get_json()
    codigo = dados.get("condigo_comp")
    
    conexao = conecta_banco()
    cursor = conexao.cursor()

    cursor.execute("DELETE FROM parcela WHERE id_compra = %s", (codigo,))
    cursor.execute("DELETE FROM compra WHERE id_compra = %s", (codigo,))
    conexao.commit()

    return jsonify({"success":"elemento excluido"}), 200

@app.route("/compra/verifica_input/<tipo>")
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
    
@app.route("/fatura/lista_nubank")
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
        "WHERE parcela.data_vencimento >= '2028-06-01' AND parcela.data_vencimento <= '2028-10-31';"
        cursor.execute(sql)
        fatura = cursor.fetchall()
        #print(fatura)
    except Exception as e :
        return jsonify({"erro": str(e)})
    
    cursor.close()
    conexao.close()

    return jsonify(fatura)

@app.route("/fatura/lista_c6")
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
        "WHERE parcela.data_vencimento >= '2028-06-01' AND parcela.data_vencimento <= '2028-10-31';"
        cursor.execute(sql)
        fatura = cursor.fetchall()
        #print(fatura)
    except Exception as e :
        return jsonify({"erro": str(e)})
    
    cursor.close()
    conexao.close()

    return jsonify(fatura)


if __name__ == "__main__":
    app.run(debug=True, port=5000)


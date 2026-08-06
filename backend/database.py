import mysql.connector

def conecta_banco():
    return mysql.connector.connect(
        host="mysql",
        user="root",
        password="12345678",
        database="proj_cartao4"
    )
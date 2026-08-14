import mysql.connector
import os

def conecta_banco():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user="root",
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )
import {
  lista_fatura_nubank_func,
  lista_fatura_c6_func,
} from "./script/fatura.js";
window.lista_fatura_nubank_func = lista_fatura_nubank_func;
window.lista_fatura_c6_func = lista_fatura_c6_func;

import {
  lista_pessoa_func,
  lista_banco_func,
  lista_loja_func,
} from "./script/criacao.js";
window.lista_pessoa_func = lista_pessoa_func;
window.lista_banco_func = lista_banco_func;
window.lista_loja_func = lista_loja_func;

import { historico_compra } from "./script/compra.js";
window.historico_compra = historico_compra;

import { lista_historico_home, faturas } from "./script/home.js";
window.lista_historico_home = lista_historico_home;
window.faturas = faturas;

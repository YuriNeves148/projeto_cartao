// HOME
import { lista_historico_home, faturas } from "./script/home.js";
window.lista_historico_home = lista_historico_home;
window.faturas = faturas;

// CRIAÇÃO
import {
  lista_pessoa_func,
  lista_banco_func,
  lista_loja_func,
  mostraAlerta,
} from "./script/criacao.js";
window.lista_pessoa_func = lista_pessoa_func;
window.lista_banco_func = lista_banco_func;
window.lista_loja_func = lista_loja_func;
window.mostraAlerta = mostraAlerta;

// INDIVIDUAL
import { lista_individual_nu, fatura, reembolso } from "./script/individual.js";
window.lista_individual_nu = lista_individual_nu;
window.fatura = fatura;
window.mostraAlerta = mostraAlerta;
window.reembolso = reembolso;

// COMPRA
import { historico_compra } from "./script/compra.js";
window.historico_compra = historico_compra;
window.mostraAlerta = mostraAlerta;

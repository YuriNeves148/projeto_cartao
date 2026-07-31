function mostrar(id) {
  document.querySelectorAll(".pagina").forEach((secao) => {
    secao.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}
window.mostrar = mostrar;
const api_url = "http://127.0.0.1:5000";

const data = new Date().getMonth();
const mesSelecionado = document.getElementById("escolha_mes");
mesSelecionado.value = data;
// mes atual como valor inicial do select
mesSelecionado.value = new Date().getMonth();

const listaa_historico = document.getElementById("lista_historico");
const valor_fatura_nubank = document.getElementById("valor_nubank");
const valor_fatura_c6 = document.getElementById("valor_c6");

// área HOME
export async function lista_historico_home(mes) {
  //console.log("mesSelecionoado: ", mesSelecionado.value);

  const resposta = await fetch(
    `${api_url}/home/lista_historico?mes=${mesSelecionado.value}`,
  );

  if (!resposta.ok) {
    alert("Erro ao acessar ao exibir a lista.");
  }
  const dado = await resposta.json();
  //console.log(dado);
  listaa_historico.innerHTML = "";

  dado.forEach((item) => {
    const dataa = new Date(item.data_compra);
    const dataFormato = dataa.toLocaleDateString("pt-BR");
    const novo_item = document.createElement("li");
    novo_item.innerHTML = `
    <span class="data">${dataFormato}</span>
    <span class="nome">${item.pessoa}</span>
    <span class="banco">${item.banco}</span>
    <span class="onde">${item.lojasite}</span>
    <span class="valor">${parseFloat(item.valor_total).toFixed(2)}</span>
    <span class="valor">${item.qtd_parcela}</span>
    <span class="valor">${parseFloat(item.valor_parcela).toFixed(2)}</span>
`;
    listaa_historico.appendChild(novo_item);
  });

  mesSelecionado.addEventListener("change", () => {
    lista_historico_home(mesSelecionado.value);
  });
  lista_historico_home;
}

export async function faturas(mes) {
  const resposta = await fetch(
    `${api_url}/home/faturas?mes=${mesSelecionado.value}`,
  );

  if (!resposta.ok) {
    alert("Não foi possível exibir fatura da nubank.");
  }

  const dado = await resposta.json();
  valor_fatura_nubank.innerHTML = "";
  valor_fatura_c6.innerHTML = "";
  //console.log(dado);

  //dado => vindo da API; c6 => chave do jsonify; fat_c6 => coluna do banco de dados
  //console.log("fatura nubank: ", dado.nubank.valor_fatura_nubank);
  //console.log("fatura C6: ", dado.c6.valor_fatura_c6);

  valor_fatura_nubank.innerHTML = `${parseFloat(dado.nubank.valor_fatura_nubank).toFixed(2)}`;
  valor_fatura_c6.innerHTML = `${parseFloat(dado.c6.valor_fatura_c6).toFixed(2)}`;

  mesSelecionado.addEventListener("change", () => {
    faturas(mesSelecionado.value);
  });
  faturas;
}

function mostrar(id) {
  document.querySelectorAll(".pagina").forEach((secao) => {
    secao.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}
window.mostrar = mostrar;
const api_url = "http://127.0.0.1:5000";

const mesAtual = new Date().getMonth();
const mesSelecionado = document.getElementById("escolha_mes");
mesSelecionado.value = mesAtual;

const listaa_historico = document.getElementById("lista_historico");
const valor_fatura_nubank = document.getElementById("valor_nubank");
const valor_fatura_c6 = document.getElementById("valor_c6");

// área HOME
export async function lista_historico() {
  const resposta = await fetch(`${api_url}/home/lista_historico`);
  if (!resposta.ok) {
    alert("Erro ao acessar ao exibir a lista.");
  }
  const dado = await resposta.json();
  listaa_historico.innerHTML = "";

  dado.forEach((item) => {
    const dataa = new Date(item.data_compra);
    const dataFormato = dataa.toLocaleDateString("pt-BR");
    const novo_item = document.createElement("li");
    novo_item.innerHTML = `
    <span class="data">${dataFormato}</span>
    <span class="nome">${item.nome_pessoa}</span>
    <span class="banco">${item.nome_banco}</span>
    <span class="onde">${item.onde}</span>
    <span class="valor">${parseFloat(item.valor_total).toFixed(2)}</span>
    <span class="valor">${item.qtd_parcela}</span>
    <span class="valor">${parseFloat(item.valor_parcela).toFixed(2)}</span>

`;

    listaa_historico.appendChild(novo_item);
  });
}

export async function faturas() {
  const resposta = await fetch(`${api_url}/home/faturas`);

  if (!resposta.ok) {
    alert("Não foi possível exibir fatura da nubank.");
  }

  const dado = await resposta.json();
  valor_fatura_nubank.innerHTML = "";
  valor_fatura_c6.innerHTML = "";

  // mas que porra aconteceu aqui?
  //console.log("fatura nubank: ", dado.fat_nu.fat_nu);
  //console.log("fatura bb: ", dado.fat_bb.fat_nu);

  valor_fatura_nubank.innerHTML = `${parseFloat(dado.fat_nu.fat_nu).toFixed(2)}`;
  valor_fatura_c6.innerHTML = `${parseFloat(dado.fat_bb.fat_nu).toFixed(2)}`;
}

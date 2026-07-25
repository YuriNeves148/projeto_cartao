const api_url = "http://127.0.0.1:5000";

// área FATURA
const lista_fatura_nubank = document.getElementById("lista_fatura_nubank");
const btn_buscar_nubank = document.getElementById("btn_buscar_nubank");
const lista_fatura_c6 = document.getElementById("lista_fatura_c6");
const btn_buscar_c6 = document.getElementById("btn_buscar_c6");

export async function lista_fatura_nubank_func() {
  const resposta = await fetch(`${api_url}/fatura/lista_nubank`);
  if (!resposta.ok) {
    alert("Não possivel se conectar com a API.");
    return;
  }
  const dado = await resposta.json();
  lista_fatura_nubank.innerHTML = "";
  //console.log(dado);
  dado.forEach((secao) => {
    const li = document.createElement("li");
    const data = new Date(secao.fatura_mes);
    const formataData = data.toLocaleDateString("pt-BR");
    li.innerHTML = `
    <span>${formataData}</span>
    <span>${secao.nome}</span>
    <span>${secao.onde}</span>
    <span>${secao.parc_faltante} </span>
    <span>${secao.valor_parcela}</span>
    `;

    //li.textContent = `${formataData} ${secao.nome} ${secao.onde} ${secao.parc_faltante} ${secao.valor_parcela}`;

    lista_fatura_nubank.appendChild(li);
  });
}
btn_buscar_nubank.addEventListener("click", lista_fatura_nubank_func);

export async function lista_fatura_c6_func() {
  const resposta = await fetch(`${api_url}/fatura/lista_c6`);
  if (!resposta.ok) {
    alert("Não possivel se conectar com a API.");
    return;
  }
  const dado = await resposta.json();
  dado.forEach((secao) => {
    const li = document.createElement("li");
    const data = new Date(secao.fatura_mes);
    const formataData = data.toLocaleDateString("pt-BR");
    li.innerHTML = `
    <span>${formataData}</span>
    <span>${secao.nome}</span>
    <span>${secao.onde}</span>
    <span>${secao.parc_faltante} </span>
    <span>${secao.valor_parcela}</span>
    `;
    lista_fatura_c6.appendChild(li);
  });
}
btn_buscar_c6.addEventListener("click", lista_fatura_c6_func);

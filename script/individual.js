const api_url = "http://127.0.0.1:5000";

const mesSelecionado = document.getElementById("escolha_mes_individual");
const lista_ind_nubank = document.getElementById("lista_gasto_nubank");
const lista_ind_c6 = document.getElementById("lista_gasto_c6");

const fatura_total_nu = document.getElementById("fatura_total_nu");
const fatura_total_c6 = document.getElementById("fatura_total_c6");

const data = new Date().getMonth();
mesSelecionado.value = data;
mesSelecionado.value = new Date().getMonth();

export async function lista_individual_nu(mes) {
  const resposta = await fetch(
    `${api_url}/individual/listas?mes=${mesSelecionado.value}`,
  );
  if (!resposta.ok) {
    alert("nao foi possivel se conectar a API (lista individual)");
    return;
  }

  const dado = await resposta.json(); // recebe as duas listas de fatura
  const nubank = dado[0]; // recebe apenas a lista da nubank
  const c6 = dado[1]; // recebe apenas a lista de c6

  // lista da area nubank
  lista_ind_nubank.innerHTML = "";

  nubank.forEach((novo_item) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${novo_item.nome_pessoa}</span>
            <span>R$   ${parseFloat(novo_item.valor_parcela).toFixed(2)}</span>
        `;
    lista_ind_nubank.appendChild(li);
  });

  // lista da area c6
  lista_ind_c6.innerHTML = "";

  c6.forEach((novo_item) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${novo_item.nome_pessoa}</span>
            <span>R$ ${parseFloat(novo_item.valor_parcela).toFixed(2)}</span>
        `;
    lista_ind_c6.appendChild(li);
  });

  mesSelecionado.addEventListener("change", () => {
    lista_individual_nu(mesSelecionado.value);
  });
}
lista_individual_nu();

export async function fatura(mes) {
  const resposta = await fetch(
    `${api_url}/individual/fatura?mes=${mesSelecionado.value}`,
  );

  if (!resposta.ok) {
    alert("nao foi possivel se conectar a API (individual fatura).");
    return;
  }
  fatura_total_nu.innerHTML = "";
  fatura_total_c6.innerHTML = "";
  const dado = await resposta.json();
  let fat_nu = parseFloat(dado.nubank[0].valor_fatura_nubank).toFixed(2);
  let fat_c6 = parseFloat(dado.c6[0].valor_fatura_c6).toFixed(2);

  //console.log("nubank: ", fat_nu);
  //console.log("c6: ", fat_c6);

  if (fat_c6 === "NaN") {
    fat_c6 = 0.0;
  }
  if (fat_nu === "NaN") {
    fat_nu = 0.0;
  }

  fatura_total_nu.innerHTML = `<strong>R$ ${fat_nu}</strong>`;
  fatura_total_c6.innerHTML = `<strong>R$ ${fat_c6}</strong>`;
  mesSelecionado.addEventListener("change", () => {
    fatura(mesSelecionado.value);
  });
}
fatura();

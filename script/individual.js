const api_url = "http://127.0.0.1:5000";

const mesSelecionado = document.getElementById("escolha_mes_individual");
const lista_ind_nubank = document.getElementById("lista_gasto_nubank");
const lista_ind_c6 = document.getElementById("lista_gasto_c6");

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
            <span>${parseFloat(novo_item.valor_parcela).toFixed(2)}</span>
        `;
    lista_ind_nubank.appendChild(li);
  });

  // lista da area c6
  lista_ind_c6.innerHTML = "";

  c6.forEach((novo_item) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${novo_item.nome_pessoa}</span>
            <span>${parseFloat(novo_item.valor_parcela).toFixed(2)}</span>
        `;
    lista_ind_c6.appendChild(li);
  });

  mesSelecionado.addEventListener("change", () => {
    lista_individual_nu(mesSelecionado.value);
  });
}
lista_individual_nu();

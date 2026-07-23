function mostrar(id) {
  document.querySelectorAll(".pagina").forEach((secao) => {
    secao.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}

const inputdata = document.getElementById("data");
const mes = document.getElementById("mes");

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const mesAtual = new Date().getMonth();
const mesSelecionado = document.getElementById("escolha_mes");
mesSelecionado.value = mesAtual;

// requisicoes
const api_url = "http://127.0.0.1:5000";

const listaa_historico = document.getElementById("lista_historico");
const valor_fatura_nubank = document.getElementById("valor_nubank");
const valor_fatura_c6 = document.getElementById("valor_c6");

// adicionar pessoa
const input_pessoa = document.getElementById("input_pessoa");
const btn_adicionar_pessoa = document.getElementById("btn_adicionar_pessoa");
// adicionar banco
const input_banco = document.getElementById("input_banco");
const btn_adicionar_banco = document.getElementById("btn_adicionar_banco");
// adicionar loja
const btn_adicionar_loja = document.getElementById("btn_adicionar_loja");
const input_loja = document.getElementById("input_loja");

// lista área CRIAÇÃO (cont = conteudo)
const lista_pessoa_cont = document.getElementById("lista_pessoa_cont");
const lista_banco_cont = document.getElementById("lista_banco_cont");
const lista_loja_cont = document.getElementById("lista_loja_cont");

// lista área COMPRA
const lista_compra_cont = document.getElementById("hist_lista_cont");
const salvar_compra = document.getElementById("salvar_compra");
const codigo = document.getElementById("nav_codigo");
const data = document.getElementById("nav_data");
const nome = document.getElementById("nav_quem");
const banco = document.getElementById("nav_banco");
const loja = document.getElementById("nav_loja");
const valor_total = document.getElementById("nav_valor_total");
const qtd_parcela = document.getElementById("nav_parcela");
let idEditandoCompra = null;
let dataEditandoCompra = null;
let nomeEditandoCompra = null;
let bancoEditandoCompra = null;
let lojaEditandoCompra = null;
let valor_totalEditandoCompra = null;
let qtd_parcelaEditandoCompra = null;
const btn_excluir_compra = document.getElementById("btn_excluir_compra");
const btn_apagar_inputs = document.getElementById("btn_apagar_inputs");
// para preencher campos da compra
const busca_nome_pessoa = document.getElementById("nav_quem");
const lista_pesquisa_pessoa = document.getElementById("pesquisa_pessoa");

// área FATURA
const lista_fatura_nubank = document.getElementById("lista_fatura_nubank");
const btn_buscar_nubank = document.getElementById("btn_buscar_nubank");

// área FATURA
async function lista_fatura_nubank_func() {
  const resposta = await fetch(`${api_url}/fatura/lista_nubank`);
  if (!resposta.ok) {
    alert("Não possivel se conectar com a API.");
    return;
  }
  const dado = await resposta.json();
  lista_fatura_nubank.innerHTML = "";
  console.log(dado);
  dado.forEach((secao) => {
    const li = document.createElement("li");
    li.textContent = `${secao.fatura_mes} ${secao.nome}`;
    lista_fatura_nubank.appendChild(li);
  });
}
btn_buscar_nubank.addEventListener("click", lista_fatura_nubank_func);

async function lista_historico() {
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

async function faturas() {
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

btn_adicionar_pessoa.addEventListener("click", async () => {
  const nome_pessoa = input_pessoa.value.trim();
  if (nome_pessoa === "") {
    alert("Digite um nome antes de salvar!");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/pessoa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome_pessoa }),
    });

    if (!resposta.ok) {
      alert("Falha ao salvar nome de pessoa");
    }
    const dado = await resposta.json();
    console.log("nome adicionado: ", dado);
    input_pessoa.value = "";
  } catch (erro) {
    alert("Erro ao conectar com o banco");
  }
});

btn_adicionar_banco.addEventListener("click", async () => {
  nome_banco = input_banco.value.trim();
  if (nome_banco === "") {
    alert("digite o nome do banco para salvar!");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/banco`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome_banco }),
    });
    if (!resposta.ok) {
      alert("Nao foi possivel salvar o nome do banco!");
    }
    const dado = await resposta.json();
    console.log("Banco adicionado: ", dado);
    input_banco.value = "";
  } catch (erro) {
    alert("erro ao acesso a API (adicionar banco).");
  }
});

btn_adicionar_loja.addEventListener("click", async () => {
  nome_loja = input_loja.value.trim();
  if (nome_loja === "") {
    alert("Digite o nome da loja antes de salvar!");
    return;
  }

  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/loja`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome_loja }),
    });
    if (!resposta.ok) {
      alert("Erro ao acessar ao salvar loja.");
      return;
    }
    const dado = await resposta.json();
    console.log("loja adicionada: ", dado);
    input_banco.value = "";
  } catch (erro) {
    alert("Erro ao acessar a API (salvar loja).");
  }
});

async function lista_pessoa_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_pessoa`);
  if (!resposta.ok) {
    alert("Erro ao acessar a API (lista pessoa)");
    return;
  }
  lista_pessoa_cont.innerHTML = "";
  dado = await resposta.json();
  dado.forEach((secao) => {
    const novo_item = document.createElement("li");
    novo_item.textContent = `${secao.nome}`; // nome da coluna no banco
    lista_pessoa_cont.appendChild(novo_item);
  });
}

async function lista_banco_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_banco`);
  if (!resposta.ok) {
    alert("Nao foi possivel conetar a API (lista banco).");
    return;
  }
  const dado = await resposta.json();
  lista_banco_cont.value = "";
  dado.forEach((secao) => {
    const novo_item = document.createElement("li");
    novo_item.textContent = `${secao.nome}`;
    lista_banco_cont.append(novo_item);
  });
}

async function lista_loja_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_loja`);
  if (!resposta.ok) {
    alert("Nao foi possivel conetar a API (lista loja).");
    return;
  }
  const dado = await resposta.json();
  lista_loja_cont.value = "";
  //console.log(dado);
  dado.forEach((secao) => {
    const novo_item = document.createElement("li");
    novo_item.textContent = `${secao.nome}`;
    lista_loja_cont.append(novo_item);
  });
}

// área COMPRA
async function historico_compra() {
  const resposta = await fetch(`${api_url}/compra/lista`);

  if (!resposta.ok) {
    alert("Erro ao acessar ao exibir a lista (compra).");
  }
  const dado = await resposta.json();
  lista_compra_cont.innerHTML = "";

  dado.forEach((item) => {
    const dataa = new Date(item.data_compra);
    const dataFormato = dataa.toLocaleDateString("pt-BR");
    const valor_parcela = `${parseFloat(item.valor_parcela).toFixed(2)}`;
    const novo_item = document.createElement("li");
    novo_item.innerHTML = `
    <span class="codigo">${item.id_compra}.</span>
    <span class="data">${dataFormato}</span>
    <span class="nome">${item.nome_pessoa}</span>
    <span class="banco">${item.nome_banco}</span>
    <span class="onde">${item.onde}</span>
    <span class="valor">${item.valor_total}</span>
    <span class="valor">${item.qtd_parcela}</span>
    <span class="valor">${valor_parcela}</span>
`;
    novo_item.dataset.id = item.id_compra;
    novo_item.addEventListener("click", () => {
      codigo.value = item.id_compra;
      console.log("a", novo_item.id_compra);
      const dataInput = dataa.toISOString().split("T")[0];
      data.value = dataInput;
      nome.value = item.nome_pessoa;
      banco.value = item.nome_banco;
      loja.value = item.onde;
      valor_total.value = item.valor_total;
      qtd_parcela.value = item.qtd_parcela;

      idEditandoCompra = item.id_compra;
      dataEditandoCompra = dataFormato;
      nomeEditandoCompra = item.nome_pessoa;
      bancoEditandoCompra = item.nome_banco;
      lojaEditandoCompra = item.onde;
      valor_totalEditandoCompra = item.valor_total;
      qtd_parcelaEditandoCompra = item.qtd_parcela;
    });
    lista_compra_cont.appendChild(novo_item);
  });
}

salvar_compra.addEventListener("click", async () => {
  valor_data = data.value.trim();
  valor_nome = nome.value.trim();
  valor_banco = banco.value.trim();
  valor_loja = loja.value.trim();
  valor_valor_total = valor_total.value.trim();
  valor_qtd_parcela = qtd_parcela.value.trim();
  if (
    valor_data === "" ||
    valor_nome === "" ||
    valor_banco === "" ||
    valor_loja === "" ||
    valor_valor_total === "" ||
    valor_qtd_parcela === ""
  ) {
    alert("Preencha todos os campos para salvar");
    return;
  }

  try {
    const resposta = await fetch(`${api_url}/compra/salvar`, {
      method: ["POST"],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data_comp: valor_data,
        nome_comp: valor_nome,
        banco_comp: valor_banco,
        loja_comp: valor_loja,
        valor_total_comp: valor_valor_total,
        qtd_parcela_comp: valor_qtd_parcela,
      }),
    });

    if (!resposta.ok) {
      alert("Nao foi possível salvar a compra.");
      return;
    }
    data.value = "";
    nome.value = "";
    banco.value = "";
    loja.value = "";
    valor_total.value = "";
    qtd_parcela.value = "";
    const dado = await resposta.json();
    console.log(dado);
  } catch (erro) {
    alert("Nao foi possivel se conectar a API");
  }
});

btn_excluir_compra.addEventListener("click", async () => {
  valor_codigo = codigo.value.trim();
  valor_data = data.value.trim();
  valor_nome = nome.value.trim();
  valor_banco = banco.value.trim();
  valor_loja = loja.value.trim();
  valor_valor_total = valor_total.value.trim();
  valor_qtd_parcela = qtd_parcela.value.trim();
  if (
    valor_codigo.value === "" ||
    valor_data.value === "" ||
    valor_nome.value === "" ||
    valor_banco.value === "" ||
    valor_loja.value === "" ||
    valor_valor_total.value === "" ||
    valor_qtd_parcela.value === ""
  ) {
    alert("Preencha todos os campos para salvar a compra.");
    return;
  }

  try {
    const resposta = await fetch(`${api_url}/compra/excluir`, {
      method: ["DELETE"],
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        condigo_comp: valor_codigo,
        data_comp: valor_data,
        nome_comp: valor_nome,
        banco_comp: valor_banco,
        loja_comp: valor_loja,
        valor_total_comp: valor_valor_total,
        qtd_parcela_comp: valor_qtd_parcela,
      }),
    });

    if (!resposta.ok) {
      alert("Nao foi possível salvar a compra.");
      return;
    }
    codigo.value = "";
    data.value = "";
    nome.value = "";
    banco.value = "";
    loja.value = "";
    valor_total.value = "";
    qtd_parcela.value = "";
    alert("compra excluida com sucesso");
    const dado = await resposta.json();
    console.log(dado);
  } catch (erro) {
    alert("Nao foi possivel se conectar a API");
  }
});

btn_apagar_inputs.addEventListener("click", () => {
  codigo.value = "";
  data.value = "";
  nome.value = "";
  banco.value = "";
  loja.value = "";
  valor_total.value = "";
  qtd_parcela.value = "";
});

busca_nome_pessoa.addEventListener("input", () => {
  const nome_input = busca_nome_pessoa.value;

  fetch(
    `http://127.0.0.1:5000/compra/verifica_input/nome_pessoa?q=${nome_input}`,
  )
    .then((resp) => resp.json())
    .then((dados) => {
      lista_pesquisa_pessoa.innerHTML = "";
      dados.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        lista_pesquisa_pessoa.appendChild(li);
      });
    });
});

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

// área CRIAÇÃO
// adicionar pessoa
const input_pessoa = document.getElementById("input_pessoa");
const btn_adicionar_pessoa = document.getElementById("btn_adicionar_pessoa");
// adicionar banco
const input_banco = document.getElementById("input_banco");
const btn_adicionar_banco = document.getElementById("btn_adicionar_banco");
// adicionar loja
const btn_adicionar_loja = document.getElementById("btn_adicionar_loja");
const input_loja = document.getElementById("input_loja");
// exibe lista
const lista_pessoa_cont = document.getElementById("lista_pessoa_cont");
const lista_banco_cont = document.getElementById("lista_banco_cont");
const lista_loja_cont = document.getElementById("lista_loja_cont");

// lista área COMPRA
const lista_compra_cont = document.getElementById("hist_lista_cont");
const btn_salvar_compra = document.getElementById("salvar_compra");
const codigo = document.getElementById("nav_codigo");
const data = document.getElementById("nav_data");
const nome = document.getElementById("nav_quem");
const banco = document.getElementById("nav_banco");
const loja = document.getElementById("nav_loja");
const valor_total = document.getElementById("nav_valor_total");
const qtd_parcela = document.getElementById("nav_parcela");
let idEditandoCompra = null; // melhorar codigo*
let dataEditandoCompra = null;
let nomeEditandoCompra = null;
let bancoEditandoCompra = null;
let lojaEditandoCompra = null;
let valor_totalEditandoCompra = null;
let qtd_parcelaEditandoCompra = null;
const listaEditando = [
  idEditandoCompra,
  dataEditandoCompra,
  nomeEditandoCompra,
  bancoEditandoCompra,
  valor_totalEditandoCompra,
  lojaEditandoCompra,
  qtd_parcelaEditandoCompra,
];
const btn_excluir_compra = document.getElementById("btn_excluir_compra");
const btn_apagar_inputs = document.getElementById("btn_apagar_inputs");
// lista ao pesquisar pelos nomes
const lista_pesquisa_pessoa = document.getElementById("pesquisa_pessoa");
const lista_pesquisa_banco = document.getElementById("pesquisa_banco");
const lista_pesquisa_loja = document.getElementById("pesquisa_loja");
// para controlar as listas quando digitar o nome de uma pessoa, um banco ou loja
const container_nome = document.querySelector(".campo_com_sugestao");
const teste_lista = document.querySelectorAll(".lista_pesquisa");

// área FATURA
const lista_fatura_nubank = document.getElementById("lista_fatura_nubank");
const btn_buscar_nubank = document.getElementById("btn_buscar_nubank");
const lista_fatura_c6 = document.getElementById("lista_fatura_c6");
const btn_buscar_c6 = document.getElementById("btn_buscar_c6");
// funções

// área HOME
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
      // opcao de melhora de codigo*
      idEditandoCompra = item.id_compra;
      dataEditandoCompra = dataFormato;
      nomeEditandoCompra = item.nome_pessoa;
      bancoEditandoCompra = item.nome_banco;
      lojaEditandoCompra = item.onde;
      valor_totalEditandoCompra = item.valor_total;
      qtd_parcelaEditandoCompra = item.qtd_parcela;
      console.log("Nome da pessoa selecionada: ", nomeEditandoCompra);
      // a cada final de chamada os valores recebem null (como na declaracao inicial)
      console.log(listaEditando.map(() => null));
    });
    lista_compra_cont.appendChild(novo_item);
  });
}

btn_salvar_compra.addEventListener("click", async () => {
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

function configurarBusca(input, lista, tipo) {
  input.addEventListener("input", () => {
    const texto = input.value.trim();

    if (texto === "") {
      lista.innerHTML = "";
      lista.style.display = "none";
      return;
    }

    fetch(`${api_url}/compra/verifica_input/${tipo}?q=${texto}`)
      .then((resposta) => resposta.json())
      .then((dado) => {
        lista.innerHTML = "";
        if (dado.length === 0) {
          lista.style.display = "none";
          return;
        }
        lista.style.display = "block";

        dado.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          li.addEventListener("click", () => {
            input.value = item;
            lista.innerHTML = "";
            lista.style.display = "none";
          });
          lista.appendChild(li);
        });
      });
  });
}
// dados que o flask receberá
configurarBusca(nome, lista_pesquisa_pessoa, "pessoa");
configurarBusca(banco, lista_pesquisa_banco, "banco");
configurarBusca(loja, lista_pesquisa_loja, "loja");

// apagar a lista de pesquisa quando clicar fora
document.addEventListener("click", (evento) => {
  const verifica = nome.value.trim();
  if (verifica === "") {
    lista_pesquisa_pessoa.innerHTML = "";

    return;
  }
  // .contains() verifica se o elemento clicado está dentro do container
  if (!container_nome.contains(evento.target)) {
    lista_pesquisa_pessoa.innerHTML = "";
    lista_pesquisa_pessoa.style.display = "none";
    lista_pesquisa_banco.style.display = "none";
    lista_pesquisa_loja.style.display = "none";
  }
});

// área FATURA
async function lista_fatura_nubank_func() {
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

async function lista_fatura_c6_func() {
  const resposta = await fetch(`${api_url}/fatura/lista_c6`);
  if (!resposta.ok) {
    alert("Não possivel se conectar com a API.");
    return;
  }
  const dado = await resposta.json();
  lista_fatura_nubank.innerHTML = "";
  console.log(dado);
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

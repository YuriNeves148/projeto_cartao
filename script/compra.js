const api_url = "http://127.0.0.1:5000";

const lista_compra_cont = document.getElementById("hist_lista_cont");
const btn_salvar_compra = document.getElementById("salvar_compra");
// inputs para compra
const codigo = document.getElementById("nav_codigo");
const data = document.getElementById("nav_data");
const nome = document.getElementById("nav_quem");
const banco = document.getElementById("nav_banco");
const loja = document.getElementById("nav_loja");
const valor_total = document.getElementById("nav_valor_total");
const qtd_parcela = document.getElementById("nav_parcela");
// adicionar id para a cada elemento da lista
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
// reembolso
const btn_reembolso = document.getElementById("btn_reembolso");
const btn_cancelar_reembolso = document.getElementById("cancelar_reembolso");
const btn_salvar_reembolso = document.getElementById("salvar_reembolso");
let input_cod_compra = document.getElementById("cod_reembolso");
let valor_reembolso = document.getElementById("valor_reembolso");
let data_reembolso = document.getElementById("data_reembolso");
// edicao
const btn_edita_compra = document.getElementById("btn_edita_compra");

export async function historico_compra() {
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
      console.log("id da compra selecionada: ", idEditandoCompra);
      // a cada final de chamada os valores recebem null (como na declaracao inicial)
    });
    lista_compra_cont.appendChild(novo_item);
  });
}

btn_salvar_compra.addEventListener("click", async () => {
  const valor_data = data.value.trim();
  const valor_nome = nome.value.trim();
  const valor_banco = banco.value.trim();
  const valor_loja = loja.value.trim();
  const valor_valor_total = valor_total.value.trim();
  const valor_qtd_parcela = qtd_parcela.value.trim();
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
  const valor_codigo = codigo.value.trim();
  const valor_data = data.value.trim();
  const valor_nome = nome.value.trim();
  const valor_banco = banco.value.trim();
  const valor_loja = loja.value.trim();
  const valor_valor_total = valor_total.value.trim();
  const valor_qtd_parcela = qtd_parcela.value.trim();
  console.log(`valor: ${valor_codigo}`);
  if (
    valor_codigo === "" ||
    valor_data === "" ||
    valor_nome === "" ||
    valor_banco === "" ||
    valor_loja === "" ||
    valor_valor_total === "" ||
    valor_qtd_parcela === ""
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
    console.error(erro);
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
  janela_reembolso.style.display = "none";
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

btn_reembolso.addEventListener("click", () => {
  if (idEditandoCompra === null) {
    alert("Selecione uma compra para pedir reembolso");
    return;
  }
  janela_reembolso.style.display = "block";
  input_cod_compra.value = idEditandoCompra;
});

btn_cancelar_reembolso.addEventListener("click", () => {
  janela_reembolso.style.display = "none";
  valor_reembolso.value = "";
  data_reembolso.value = "";
  codigo.value = "";
  data.value = "";
  nome.value = "";
  banco.value = "";
  loja.value = "";
  valor_total.value = "";
  qtd_parcela.value = "";
});

btn_salvar_reembolso.addEventListener("click", async () => {
  const codigo_comp = idEditandoCompra;
  const valor_r = valor_reembolso.value.trim();
  const data_r = data_reembolso.value.trim();

  if (valor_r === "" || data_r === "") {
    alert("preencha todos os campos para salvar o reembolso");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/compra/reembolso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: codigo_comp,
        valor: valor_r,
        data: data_r,
      }),
    });
    const dado = await resposta.json();
    if (!resposta.ok) {
      alert("Não foi possível se conectar a API (salvar reembolso)");
      return;
    }
    //console.log(dado);
    alert("Reembolso salvo com sucesso.\n");
    janela_reembolso.style.display = "none";
    valor_reembolso.value = "";
    data_reembolso.value = "";
  } catch (erro) {
    console.error(erro);
  }
});

btn_edita_compra.addEventListener("click", async () => {
  if (codigo.value === "") {
    alert("Selecione um item para editar.");
    return;
  }

  if (
    codigo.value === "" ||
    nome.value === "" ||
    data.value === "" ||
    banco.value === "" ||
    loja.value === "" ||
    qtd_parcela.value === ""
  ) {
    alert("Preencha todos os campos para salvar a edição.");
    return;
  }
  console.log(dataEditandoCompra);
  const data_recebida = new Date(dataEditandoCompra);
  const data_formatada = data_recebida.toISOString().split("T")[0];

  try {
    const resposta = await fetch(`${api_url}/compra/edicao`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idEditandoCompra,
        data: data_formatada,
        nome: nome.value,
        banco: banco.value,
        loja: loja.value,
        valor_total: valor_total.value,
        qtd_parcela: qtd_parcela.value,
      }),
    });
    if (!resposta.ok) {
      alert("Nao foi possivel se conectar a API (editar compra).");
      return;
    }
    const dado = await resposta.json();
    console.log(dado);
    codigo.value === "";
    data.value === "";
    nome.value === "";
    banco.value === "";
    loja.value === "";
    valor_total.value === "";
    qtd_parcela.value === "";
    alert("Compra alterada!");
    location.reload();
  } catch (erro) {
    console.error(erro);
  }
});

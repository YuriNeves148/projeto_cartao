const api_url = "http://127.0.0.1:5000";

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

// área CRIAÇÃO
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
  const nome_banco = input_banco.value.trim();
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
  const nome_loja = input_loja.value.trim();
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

export async function lista_pessoa_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_pessoa`);
  if (!resposta.ok) {
    alert("Erro ao acessar a API (lista pessoa)");
    return;
  }
  lista_pessoa_cont.innerHTML = "";
  const dado = await resposta.json();
  dado.forEach((secao) => {
    const novo_item = document.createElement("li");
    novo_item.textContent = `${secao.nome}`; // nome da coluna no banco
    lista_pessoa_cont.appendChild(novo_item);
  });
}

export async function lista_banco_func() {
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

export async function lista_loja_func() {
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

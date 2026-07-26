// poderia crar uma funcao apenas para adicionar pessoa, banco e loja*

const api_url = "http://127.0.0.1:5000";

// inputs
const input_pessoa = document.getElementById("input_pessoa");
const input_banco = document.getElementById("input_banco");
const input_loja = document.getElementById("input_loja");
// adicionar
const btn_adicionar_pessoa = document.getElementById("btn_adicionar_pessoa");
const btn_adicionar_banco = document.getElementById("btn_adicionar_banco");
const btn_adicionar_loja = document.getElementById("btn_adicionar_loja");
// excluir
const btn_excluir_pessoa = document.getElementById("excluir_pessoa");
const btn_excluir_loja = document.getElementById("excluir_loja");
const btn_excluir_banco = document.getElementById("excluir_banco");
// exibe lista
const lista_pessoa_cont = document.getElementById("lista_pessoa_cont");
const lista_banco_cont = document.getElementById("lista_banco_cont");
const lista_loja_cont = document.getElementById("lista_loja_cont");
// para editar

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
    // sendo clicavel e adicionando no input
    novo_item.addEventListener("click", () => {
      input_pessoa.value = secao.nome;
    });
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
    novo_item.addEventListener("click", () => {
      input_banco.value = secao.nome;
    });
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
    novo_item.addEventListener("click", () => {
      input_loja.value = secao.nome;
    });
  });
}

btn_excluir_pessoa.addEventListener("click", async () => {
  const nome_pessoa = input_pessoa.value.trim();
  if (nome_pessoa === "") {
    alert("Digite o nome da pessoa para excluir!");
  }

  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_pessoa`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pessoa: nome_pessoa }),
    });

    const dado = await resposta.json();
    if (!resposta.ok) {
      alert(dado.erro);
      return;
    }
    alert(`Pessoa excluída com sucesso!`);
    console.log(dado);
    return;
  } catch (erro) {
    console.error(erro);
    alert("Erro ao excluir pessoa!");
  }
});

btn_excluir_loja.addEventListener("click", async () => {
  const input = input_loja.value.trim();

  if (input === "") {
    alert("Digite o nome da loja pu site para excluir.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_loja`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: input }),
    });
    const dado = await resposta.json();
    if (!resposta.ok) {
      console.log(dado.erro);
      alert("Loja ou site inexistente.");
      return;
    }
    console.log(dado);
    alert(`Loja '${dado.nome}' excluida com sucesso!"`);
    input_loja.value = "";
    return;
  } catch (erro) {
    alert("Erro encontrado: ", erro);
  }
});

btn_excluir_banco.addEventListener("click", async () => {
  const input = input_banco.value.trim();

  if (input === "") {
    alert("Digite o nome do banco para excluir.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_banco`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: input }),
    });
    const dado = await resposta.json();
    if (!resposta.ok) {
      console.log(dado.erro);
      alert("Banco inexistente.");
      return;
    }
    console.log(dado);
    alert(`Banco '${dado.nome}' excluido com sucesso!"`);
    input_banco.value = "";
    return;
  } catch (erro) {
    alert("Erro encontrado: ", erro);
  }
});

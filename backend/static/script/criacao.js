// autorizacao
const token = localStorage.getItem("token");
const id_usuario = localStorage.getItem("id_usuario");
console.log("id_usuario: ", id_usuario);
// se o token nao existir, manda novamente para a tela de login
if (!token) {
  window.location.href = "/";
}

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
// editar
const btn_editar_pessoa = document.getElementById("editar_pessoa");
const btn_editar_banco = document.getElementById("editar_banco");
const btn_editar_loja = document.getElementById("editar_loja");
let nomePessoaEditando = null;
let idPessoaEditando = null;
let nomeBancoEditando = null;
let idBancoEditando = null;
let idLojaEditando = null;
let nomeLojaEditando = null;

// exibe lista
const lista_pessoa_cont = document.getElementById("lista_pessoa_cont");
const lista_banco_cont = document.getElementById("lista_banco_cont");
const lista_loja_cont = document.getElementById("lista_loja_cont");

// ADIÇÃO
btn_adicionar_pessoa.addEventListener("click", async () => {
  const nome_pessoa = input_pessoa.value.trim();
  if (nome_pessoa === "") {
    mostraAlerta("aviso", "Digite o nome da pessoa para adicionar!");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/pessoa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nome_pessoa }),
    });

    if (!resposta.ok) {
      mostraAlerta("erro", "Nome da pessoa já cadastrada!");
      return;
    }
    const dado = await resposta.json();
    console.log(dado);
    console.log("nome adicionado: ", dado);
    input_pessoa.value = "";
    mostraAlerta("sucesso", "Pessoa cadastrada com sucesso!");
  } catch (erro) {
    mostraAlerta("erro", erro);
  }
});

btn_adicionar_banco.addEventListener("click", async () => {
  const nome_banco = input_banco.value.trim();
  if (nome_banco === "") {
    mostraAlerta("aviso", "Digite do banco para adicionar!");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/banco`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nome_banco }),
    });
    if (!resposta.ok) {
      mostraAlerta("erro", "Nome do banco já cadastrado!");
      return;
    }
    const dado = await resposta.json();
    console.log("Banco adicionado: ", dado);
    input_banco.value = "";
    mostraAlerta("sucesso", "Banco cadastrado com sucesso!");
  } catch (erro) {
    mostraAlerta("erro", `erro: ${erro}`);
    return;
  }
});

btn_adicionar_loja.addEventListener("click", async () => {
  const nome_loja = input_loja.value.trim();
  if (nome_loja === "") {
    mostraAlerta("aviso", "Digite da loja ou site para adicionar!");
    return;
  }

  try {
    const resposta = await fetch(`${api_url}/criacao/adicionar/loja`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nome_loja }),
    });
    if (!resposta.ok) {
      mostraAlerta("erro", "Nome da loja ou site já cadastrado!");
      return;
    }
    const dado = await resposta.json();
    console.log("loja adicionada: ", dado);
    input_loja.value = "";
    mostraAlerta("sucesso", "Loja ou site cadastrado com sucesso!");
  } catch (erro) {
    mostraAlerta("erro", `erro: ${erro}`);
  }
});

// LISTAS
export async function lista_pessoa_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_pessoa`, {
    method: "GET",
    headers: {
      "Content-Type": "application-json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resposta.ok) {
    mostraAlerta("erro", "Nome da loja ou site já cadastrado!");
    return;
  }
  lista_pessoa_cont.innerHTML = "";

  const dado = await resposta.json();
  console.log(dado);

  dado.forEach((secao) => {
    const novo_item = document.createElement("li");
    novo_item.textContent = `${secao.nome}`; // nome da coluna no banco
    lista_pessoa_cont.appendChild(novo_item);
    // sendo clicavel e adicionando no input
    novo_item.addEventListener("click", () => {
      input_pessoa.value = secao.nome;
      idPessoaEditando = secao.id_pessoa;
      nomePessoaEditando = secao.nome;
      input_pessoa.focus();
      console.log(`EDITANDO: ${idPessoaEditando}. ${nomePessoaEditando}`);
    });
  });
}

export async function lista_banco_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_banco`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
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
      nomeBancoEditando = secao.nome;
      idBancoEditando = secao.id_banco;
      console.log(`EDITANDO: ${idBancoEditando}. ${nomeBancoEditando}`);
      input_banco.focus();
    });
  });
}

export async function lista_loja_func() {
  const resposta = await fetch(`${api_url}/criacao/lista_loja`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
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

      idLojaEditando = secao.id_lojasite;
      nomeLojaEditando = secao.nome;
      console.log(`EDITANDO: ${idLojaEditando}. ${nomeLojaEditando}`);
    });
  });
}

// EXCLUSÃO
btn_excluir_pessoa.addEventListener("click", async () => {
  const nome_pessoa = input_pessoa.value.trim();
  if (nome_pessoa === "") {
    mostraAlerta("aviso", "Digite o nome da pessoa para excluí-la!");
    return;
  }

  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_pessoa`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pessoa: nome_pessoa }),
    });
    if (!resposta.ok) {
      const v = await resposta.json();
      console.log(v);
      mostraAlerta("erro", `${v.erro}`);
      return;
    }
    const dado = await resposta.json();
    mostraAlerta("sucesso", "Pessoa deletada com sucesso");
    return;
  } catch (erro) {
    console.error("Erro: ", erro);
    mostraAlerta("erro", `excluir pessoa: ${erro}`);
  }
});

btn_excluir_loja.addEventListener("click", async () => {
  const input = input_loja.value.trim();
  if (input === "") {
    mostraAlerta("aviso", "Digite uma loja ou site para adicionar.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_loja`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: input }),
    });
    if (!resposta.ok) {
      const v = await resposta.json();
      console.log("resposta v: ", v);
      mostraAlerta("erro", `${v.erro}`);
      return;
    }
    const dado = await resposta.json();
    console.log(dado);
    mostraAlerta(
      "sucesso",
      `'${input_loja.value.trim()}' excluído com sucesso.`,
    );
    input_loja.value = "";
    return;
  } catch (erro) {
    alert("erro: ", erro);
  }
});

btn_excluir_banco.addEventListener("click", async () => {
  const input = input_banco.value.trim();
  if (input === "") {
    mostraAlerta("aviso", "Digite o nome do banco para excluí-lo.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/excluir_banco`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: input }),
    });
    if (!resposta.ok) {
      const a = await resposta.json();
      mostraAlerta("erro", `${a.erro}`);
      return;
    }
    const dado = await resposta.json();
    console.log(dado);
    mostraAlerta("sucesso", `${dado.sucesso}`);
    input_banco.value = "";
  } catch (erro) {
    mostraAlerta("erro", "Erro: ", erro);
  }
});

// EDIÇÃO
btn_editar_pessoa.addEventListener("click", async () => {
  //const input_orig_nome = nomePessoaEditando;
  const input_orig_id_nome = idPessoaEditando;
  const input_orig_nome = nomePessoaEditando;
  const nome_alterado = input_pessoa.value.trim();
  if (
    input_orig_id_nome === null ||
    input_orig_nome === null ||
    nome_alterado === ""
  ) {
    mostraAlerta("aviso", "Clique no nome da pessoa para editar.");
    return;
  }
  if (nome_alterado == input_orig_nome) {
    mostraAlerta("aviso", "Não houve alteração no nome.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/edita_pessoa`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_original: input_orig_id_nome,
        nome_original: input_orig_nome,
        nome_novo: nome_alterado,
      }),
    });
    if (!resposta.ok) {
      const v = await resposta.json();
      mostraAlerta(
        "erro",
        "Esse nome já está sendo utilizado. Verifique a lista.",
      );
      return;
    }
    const dado = await resposta.json();
    input_pessoa.value = "";
    mostraAlerta("sucesso", `${dado.sucesso}`);
  } catch (erro) {
    console.error(dado.erro);
  }
});

btn_editar_banco.addEventListener("click", async () => {
  const input_orig_id_nome = idBancoEditando;
  const input_orig_nome = nomeBancoEditando;
  const nome_alterado = input_banco.value.trim();

  if (
    input_orig_id_nome === null ||
    input_orig_nome === null ||
    nome_alterado === ""
  ) {
    mostraAlerta("aviso", "Clique no nome do banco para editar.");
    input_banco.value = "";
    return;
  }
  if (nome_alterado == input_orig_nome) {
    mostraAlerta("aviso", "Nome do banco não alterado.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/edita_banco`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_original: input_orig_id_nome,
        nome_original: input_orig_nome,
        nome_novo: nome_alterado,
      }),
    });
    if (!resposta.ok) {
      const a = await resposta.json();
      mostraAlerta("erro", a.erro);
      input_banco.value = "";
      return;
    }
    const dado = await resposta.json();
    input_banco.value = "";
    console.log("Resposta ", dado);
    mostraAlerta("sucesso", dado.sucesso);
  } catch (erro) {
    console.error(dado.erro);
  }
});

btn_editar_loja.addEventListener("click", async () => {
  const input_orig_id_nome = idLojaEditando;
  const input_orig_nome = nomeLojaEditando;
  const nome_alterado = input_loja.value.trim();
  console.log(input_orig_id_nome);
  console.log(input_orig_nome);
  if (
    input_orig_id_nome === null ||
    input_orig_nome === null ||
    nome_alterado === ""
  ) {
    mostraAlerta("aviso", "Clique no nome da loja/site para editar.");
    input_loja.value = "";
    return;
  }
  if (nome_alterado == input_orig_nome) {
    mostraAlerta("aviso", "Nome da loja/site não teve alteração.");
    return;
  }
  try {
    const resposta = await fetch(`${api_url}/criacao/edita_loja`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_original: input_orig_id_nome,
        nome_original: input_orig_nome,
        nome_novo: nome_alterado,
      }),
    });

    if (!resposta.ok) {
      const a = await resposta.json();
      mostraAlerta("erro", a.erro);
      return;
    }
    const dado = await resposta.json();
    console.log("Resposta ", dado.sucesso);
    mostraAlerta("sucesso", dado.sucesso);
    input_loja.value = "";
  } catch (erro) {
    console.error(dado.erro);
  }
});

export function mostraAlerta(tipo = "sucesso", mensagem) {
  const alerta = document.getElementById("mensagem_alerta");

  alerta.textContent = mensagem;
  alerta.className = `mensagem_alerta ${tipo} mostrar`;

  setTimeout(() => {
    alerta.className = "mensagem_alerta";
  }, 4000);
}

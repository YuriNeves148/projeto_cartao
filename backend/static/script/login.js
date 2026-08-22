const api_url = "http://127.0.0.1:5000";
const btn_criar = document.getElementById("btn_criar");
const criar_user = document.getElementById("criar_user");
const criar_senha = document.getElementById("criar_senha");
const btn_logar = document.getElementById("btn_logar");
const input_logar = document.getElementById("input_logar");
const input_logar_senha = document.getElementById("input_logar_senha");

btn_criar.addEventListener("click", async () => {
  if (criar_senha.value.trim() === "" || criar_user.value.trim() === "") {
    alert("Preencha todos os campos!");
    return;
  }
  const user = criar_user.value.trim();
  const senha = criar_senha.value.trim();

  console.log(`user: ${user}\nsenha: ${senha}`);

  const resposta = await fetch(`${api_url}/criar_usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: user, senha: senha }),
  });
  const dado = await resposta.json();

  console.log(dado);
  alert(`Usuário  '${dado.user}'  criado com sucesso.`);
  // teria que retirar os tokens criados/salvos? *
  criar_user.value = "";
  criar_senha.value = "";
});

btn_logar.addEventListener("click", async () => {
  window.location.href = "/app";
});

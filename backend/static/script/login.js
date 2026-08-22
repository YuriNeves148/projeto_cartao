const api_url = "http://127.0.0.1:5000";
const btn_criar = document.getElementById("btn_criar");
const criar_user = document.getElementById("criar_user");
const criar_senha = document.getElementById("criar_senha");

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

  window.location.href = "/app";
});

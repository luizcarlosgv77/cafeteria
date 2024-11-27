// Obtém os elementos de navegação e seções
const links = document.querySelectorAll("nav ul li a");
const sections = document.querySelectorAll("main section");

// Função para mostrar a seção correspondente ao item clicado
function showSection(event) {
  // Previne o comportamento padrão de navegação (scroll para a âncora)
  event.preventDefault();

  // Remove a classe 'active' de todos os links e seções
  links.forEach((link) => link.classList.remove("active"));
  sections.forEach((section) => section.classList.remove("active"));

  // Adiciona a classe 'active' ao link clicado e à seção correspondente
  const clickedLink = event.target;
  clickedLink.classList.add("active");

  // Encontrar a seção correspondente e mostrá-la
  const targetId = clickedLink.getAttribute("href").substring(1); // Remove o "#" da URL
  const targetSection = document.getElementById(targetId);
  targetSection.classList.add("active");
}

// Adiciona o evento de clique a cada link
links.forEach((link) => {
  link.addEventListener("click", showSection);
});

// Opcional: inicializar com a primeira seção visível
document.addEventListener("DOMContentLoaded", () => {
  links[0].classList.add("active"); // Ativa o primeiro link
  sections[0].classList.add("active"); // Mostra a primeira seção
});

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let total = 0;

// Adiciona itens ao carrinho
function adicionarCarrinho(nome, preco) {
  let itemExistente = carrinho.find((item) => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  // Salva o carrinho no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  atualizarCarrinho();
}

// Atualiza a tela do carrinho
function atualizarCarrinho() {
  // Calcular o total de itens no carrinho somando as quantidades de cada item
  let totalItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  // Atualiza a contagem do carrinho
  document.getElementById("cart-count").innerText = totalItens;

  // Atualiza os itens no carrinho
  let cartItemsHtml = "";
  total = 0; // Resetando o total
  carrinho.forEach((item) => {
    total += item.preco * item.quantidade;
    cartItemsHtml += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.nome}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">R$ ${item.preco.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantidade}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <button onclick="alterarQuantidade('${item.nome}', 1)" style="background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 5px;">+</button>
          <button onclick="alterarQuantidade('${item.nome}', -1)" style="background-color: #f44336; color: white; padding: 5px 10px; border-radius: 5px;">-</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("cart-items").innerHTML = cartItemsHtml;
  document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;

  // Exibe ou oculta o botão de finalizar compra com base na quantidade de itens no carrinho
  const finalizarBtn = document.getElementById("finalizar-btn");
  if (totalItens > 0) {
    finalizarBtn.style.display = "inline-block"; // Exibe o botão se houver itens no carrinho
  } else {
    finalizarBtn.style.display = "none"; // Oculta o botão se não houver itens no carrinho
  }
}

// Altera a quantidade de um item no carrinho
function alterarQuantidade(nome, delta) {
  let item = carrinho.find((item) => item.nome === nome);

  if (item) {
    item.quantidade += delta;

    // Se a quantidade for zero ou menor, remove o item do carrinho
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter((item) => item.nome !== nome);
    }

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinho();
  }
}

// Abre a tela do carrinho
function abrirCarrinho() {
  document.getElementById("cart-screen").style.display = "block";
}

// Fecha a tela do carrinho
function fecharCarrinho() {
  document.getElementById("cart-screen").style.display = "none";
}

// Função para finalizar a compra
function finalizarCompra() {
  const confirmar = confirm("Tem certeza que deseja finalizar a compra?");
  if (confirmar) {
    if (!localStorage.getItem("user")) {
      alert("Você precisa estar logado para finalizar a compra!");
      window.location.href = "login.html"; // Redireciona para a tela de login
    } else {
      let user = JSON.parse(localStorage.getItem("user"));

      // Vincula o usuário com a compra
      let compra = {
        usuario: user,
        itens: carrinho,
        total: total,
      };

      // Salva os dados da compra no localStorage (ou em um servidor)
      localStorage.setItem("carrinho", JSON.stringify(compra));
      window.location.href = "carrinho.html";
    }
  }
}

// Chama a função de carregar o carrinho ao carregar a página de finalização
document.addEventListener("DOMContentLoaded", atualizarCarrinho);

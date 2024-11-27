let carrinhoData = JSON.parse(localStorage.getItem("carrinho")) || {
  itens: [],
  total: 0,
};
let cart = carrinhoData.itens;

function exibirCarrinho() {
  const produtosCarrinho = document.getElementById("produtosCarrinho");
  let total = 0;
  let tabela =
    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
  tabela +=
    '<thead><tr><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produto</th><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Preço</th><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantidade</th><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th></tr></thead>';
  tabela += "<tbody>";

  if (cart.length === 0) {
    produtosCarrinho.innerHTML =
      '<p style="color: red;">Carrinho vazio! Adicione itens ao carrinho.</p>';
    return;
  }

  cart.forEach((item) => {
    const totalItem = item.preco * item.quantidade;
    tabela += `<tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  item.nome
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">R$ ${item.preco.toFixed(
                  2
                )}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  item.quantidade
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">R$ ${totalItem.toFixed(
                  2
                )}</td>
            </tr>`;
    total += totalItem;
  });

  tabela += "</tbody></table>";
  tabela += `<p style="font-size: 18px; color: #333;">Total: R$ ${total.toFixed(
    2
  )}</p>`;

  produtosCarrinho.innerHTML = tabela;
}

function cancelarCompra() {
  const confirmar = confirm("Tem certeza que deseja cancelar a compra?");
  if (confirmar) {
    localStorage.removeItem("carrinho");
    window.location.href = "catalogo.html";
  }
}

function finalizarCompra() {
  const pagamentoSelecionado = document.querySelector(
    'input[name="pagamento"]:checked'
  );
  if (!pagamentoSelecionado) {
    alert("Por favor, escolha um método de pagamento!");
    return;
  }
  
  const confirmar = confirm("Tem certeza que deseja finalizar a compra?");
  if (confirmar) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título centralizado
    doc.setFontSize(18);
    doc.text("Comprovante de Compra", 105, 20, { align: "center" });

    // Linha de separação
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
    
    // Subtítulo
    doc.setFontSize(14);
    doc.text("Melhor Café", 105, 30, { align: "center" });

    // Detalhes da compra
    let yPosition = 40;
    cart.forEach((item) => {
      const totalItem = item.preco * item.quantidade;
      doc.text(
        `${item.nome} - Quantidade: ${item.quantidade} - R$ ${totalItem.toFixed(2)}`,
        20,
        yPosition
      );
      yPosition += 8;
    });

    // Linha de separação entre itens e total
    doc.line(10, yPosition + 5, 200, yPosition + 5);
    
    // Total da compra
    const totalCompra = cart.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0
    );
    doc.setFontSize(12);
    doc.text(`Total: R$ ${totalCompra.toFixed(2)}`, 20, yPosition + 15);
    
    // Método de pagamento
    doc.text(
      `Método de pagamento: ${pagamentoSelecionado.value}`,
      20,
      yPosition + 25
    );

    // Linha de rodapé
    doc.line(10, yPosition + 35, 200, yPosition + 35);
    doc.text("Obrigado pela sua compra!", 105, yPosition + 40, { align: "center" });
    
    // Salvando o PDF
    doc.save("comprovante_compra.pdf");
    alert("Compra finalizada com sucesso! Comprovante gerado!");
    localStorage.removeItem("carrinho");
    window.location.href = "catalogo.html";
  }
}

exibirCarrinho();

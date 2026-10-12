const produtos = [
    { id: 1, nome: "Cuscuz recheado", descricao: "Cuscuz de milho com recheio regional.", preco: 18.90, categoria: "Cuscuz", imagem: "imagens/cuscuz-recheado.jpg", unidades: ["recife", "ipanema", "natal"] },
    { id: 2, nome: "Tapioca de queijo", descricao: "Tapioca preparada na hora com queijo.", preco: 16.50, categoria: "Tapioca", imagem: "imagens/tapioca-queijo.jpg", unidades: ["recife", "ipanema", "natal"] },
    { id: 3, nome: "Bolo de macaxeira", descricao: "Fatia de bolo tradicional da casa.", preco: 9.50, categoria: "Bolos", imagem: "imagens/bolo-macaxeira.jpg", unidades: ["recife", "natal"] },
    { id: 4, nome: "Café passado", descricao: "Café coado na hora.", preco: 5.50, categoria: "Bebidas", imagem: "imagens/cafe-passado.jpg", unidades: ["recife", "ipanema", "natal"] },
    { id: 5, nome: "Suco de cajá", descricao: "Suco regional gelado.", preco: 8.90, categoria: "Bebidas", imagem: "imagens/suco-caja.jpg", unidades: ["recife", "ipanema"] },
    { id: 6, nome: "Tapioca de frango", descricao: "Tapioca com frango temperado.", preco: 19.90, categoria: "Tapioca", imagem: "imagens/tapioca-frango.jpg", unidades: ["recife", "ipanema", "natal"] }
];

const nomesUnidades = {
    recife: "Recife — Boa Viagem",
    ipanema: "Rio de Janeiro — Ipanema",
    natal: "Natal — Tirol"
};

const informacoesUnidades = {
    recife: "Retirada no local • Unidade demonstrativa para atividade acadêmica.",
    ipanema: "Retirada no local • Bolo de macaxeira indisponível nesta unidade.",
    natal: "Retirada no local • Suco de cajá indisponível nesta unidade."
};

let unidadeAtual = "recife";
let categoriaAtual = "Todos";
let carrinho = {};
let numeroPedido = 1000;
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
function mostrarProdutos() {
    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    produtos.forEach(function(produto) {
        if (categoriaAtual !== "Todos" && produto.categoria !== categoriaAtual) {
            return;
        }

        const disponivel = produto.unidades.includes(unidadeAtual);
        const artigo = document.createElement("article");
        artigo.className = "produto";

        artigo.innerHTML = `
            <div class="produto-imagem"><img src="${produto.imagem}" alt="${produto.nome}" loading="lazy"></div>
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="preco">${formatarPreco(produto.preco)}</div>
                <div class="${disponivel ? "disponivel" : "indisponivel"}">
                    ${disponivel ? "Disponível nesta unidade" : "Indisponível nesta unidade"}
                </div>
                <button ${disponivel ? "" : "disabled"}>
                    ${disponivel ? "Adicionar ao carrinho" : "Indisponível"}
                </button>
            </div>
        `;

        if (disponivel) {
            artigo.querySelector("button").addEventListener("click", function() {
                adicionarCarrinho(produto.id);
            });
        }

        lista.appendChild(artigo);
    });
}
function adicionarCarrinho(id) {
    carrinho[id] = (carrinho[id] || 0) + 1;
    mostrarCarrinho();
    mostrarMensagem("Produto adicionado ao carrinho.", false);
}
function alterarQuantidade(id, valor) {
    carrinho[id] = (carrinho[id] || 0) + valor;

    if (carrinho[id] <= 0) {
        delete carrinho[id];
    }

    mostrarCarrinho();
}
function mostrarCarrinho() {
    const areaCarrinho = document.getElementById("itensCarrinho");
    const itens = Object.entries(carrinho);
    let subtotal = 0;
    let quantidadeTotal = 0;

    areaCarrinho.innerHTML = "";

    if (itens.length === 0) {
        areaCarrinho.innerHTML = '<p class="carrinho-vazio">Seu carrinho ainda está vazio. Escolha algo no cardápio!</p>';
    }

    itens.forEach(function([id, quantidade]) {
        const produto = produtos.find(function(item) {
            return item.id === Number(id);
        });
        if (!produto || !produto.unidades.includes(unidadeAtual)) {
            delete carrinho[id];
            return;
        }

        subtotal += produto.preco * quantidade;
        quantidadeTotal += quantidade;

        const itemCarrinho = document.createElement("div");
        itemCarrinho.className = "item-carrinho";
        itemCarrinho.innerHTML = `
            <div>
                <strong>${produto.nome}</strong><br>
                <small>${formatarPreco(produto.preco)} cada</small><br>
                <small>Subtotal: ${formatarPreco(produto.preco * quantidade)}</small>
            </div>
            <div class="controles">
                <button aria-label="Diminuir ${produto.nome}">−</button>
                <span>${quantidade}</span>
                <button aria-label="Aumentar ${produto.nome}">+</button>
            </div>
        `;

        const botoes = itemCarrinho.querySelectorAll("button");
        botoes[0].addEventListener("click", function() {
            alterarQuantidade(produto.id, -1);
        });
        botoes[1].addEventListener("click", function() {
            alterarQuantidade(produto.id, 1);
        });

        areaCarrinho.appendChild(itemCarrinho);
    });

    document.getElementById("quantidadeCarrinho").textContent = quantidadeTotal;
    document.getElementById("resumoUnidade").textContent = nomesUnidades[unidadeAtual];
    document.getElementById("subtotal").textContent = formatarPreco(subtotal);
    document.getElementById("total").textContent = formatarPreco(subtotal);
}
function mostrarMensagem(texto, deuErro) {
    const mensagem = document.getElementById("mensagemPedido");
    mensagem.textContent = texto;
    mensagem.className = texto ? "mensagem" + (deuErro ? " erro" : "") : "";
}
document.getElementById("unidade").addEventListener("change", function() {
    unidadeAtual = this.value;
    document.getElementById("infoUnidade").textContent = informacoesUnidades[unidadeAtual];
    mostrarProdutos();
    mostrarCarrinho();
    mostrarMensagem("", false);
});
document.querySelectorAll(".filtro").forEach(function(botao) {
    botao.addEventListener("click", function() {
        document.querySelectorAll(".filtro").forEach(function(outroBotao) {
            outroBotao.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        categoriaAtual = botao.dataset.categoria;
        mostrarProdutos();
    });
});
document.getElementById("irCarrinho").addEventListener("click", function() {
    document.getElementById("carrinho").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("continuarPedido").addEventListener("click", function() {
    if (Object.keys(carrinho).length === 0) {
        mostrarMensagem("Adicione um produto antes de continuar.", true);
        return;
    }

    const confirmou = window.confirm("Este é apenas um pedido demonstrativo. Deseja continuar?");
    if (!confirmou) {
        return;
    }

    numeroPedido++;
    document.getElementById("statusPedido").innerHTML = `
        <div class="mensagem">
            <strong>Pedido demonstrativo #${numeroPedido}</strong><br>
            Pedido recebido! O status é simulado e nada foi enviado para uma loja real.
        </div>
        <p>Unidade: ${nomesUnidades[unidadeAtual]}</p>
        <p>Próximas etapas de exemplo: em preparo, pronto para retirada e concluído.</p>
    `;

    carrinho = {};
    mostrarCarrinho();
    mostrarMensagem("Pedido demonstrativo criado.", false);
});
document.getElementById("verPontos").addEventListener("click", function() {
    const mensagem = document.getElementById("mensagemPontos");
    mensagem.textContent = "Demonstração: você tem 120 pontos. Este saldo não é real.";
    mensagem.className = "mensagem";
});
function abrirAviso(titulo, texto) {
    document.getElementById("tituloModal").textContent = titulo;
    document.getElementById("textoModal").textContent = texto;
    const elementoModal = document.getElementById("avisoModal");
    const modal = bootstrap.Modal.getOrCreateInstance(elementoModal);
    modal.show();
}

document.getElementById("privacidade").addEventListener("click", function() {
    abrirAviso(
        "Privacidade",
        "Este protótipo não envia nem guarda dados pessoais. Em um sistema real, a empresa precisaria explicar como usa os dados e seguir a LGPD."
    );
});

document.getElementById("acessibilidade").addEventListener("click", function() {
    abrirAviso(
        "Acessibilidade",
        "O site foi montado para ser simples de navegar, mas ainda precisa de testes com teclado, leitores de tela e ferramentas de contraste."
    );
});

mostrarProdutos();
mostrarCarrinho();

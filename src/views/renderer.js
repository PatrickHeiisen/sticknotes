/**
 * Processo de renderização do documento index.js
 */

console.log("Processo de renderização")

// Estrategia para renderizar (desenhar as notas adesivas)
// Usar uma lista para preencher de formar dinamica os itens(notas)

// Vetor global para manipular os dados do banco
let arrayNotes = []

// Captura do id da list <ul> do documento index
const list = document.getElementById('listNotes')

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Troca do icone do banco de dados (Status da conexão)
// uso da api do preload.js
api.dbStatus((event, message) => {
    // Teste de recebimento da mensagem
    console.log(message)

    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"
    }
})

// enviar ao main um pedido para conectar com o banco de dados quando a janela principal for inicializada
api.dbConnect()
//================================================================================

//== CRUID READ ==================================================================
// Passo 1: Enviar ao main um pedido para listar as notas
api.listNotes()

// Passo 5: Recebimento da notas via Ipc e renderização
api.renderNotes((event, notes) => {
    const renderNotes = JSON.parse(notes) // JSON.parse converte de string para JSON
    console.log(renderNotes) // teste passo 5
    // Renderizar no index o conteudo do array
    arrayNotes = renderNotes // Atribuir ao vetor o JSON recebido
    // Uso do laço forEach para percorrer o vetor e extrair os dados
    arrayNotes.forEach((n) => {
        // Adição de tags <li> no documento index
        // var (--${n.cor}) aplicar a cor definida nas variaveis CSS
        list.innerHTML += `
        <li class = "card" style = "background-color: var(--${n.cor});">
            <p onclick = "deleteNote('${n._id}')" id ="x">X</p>
            <p id = "code">${n._id}</p>
            <p>${n.texto}</p>
            <p id = "color">${n.cor}</p>
        </li>
      `
    })
})
//================================================================================
//== FIM - CRUID READ ============================================================
//********************************************************************************
// Atualização das Notas =========================================================
api.mainReload((args) => {
    location.reload()
})
// Fim - Atualização das Notas ===================================================
//********************************************************************************
//================================================================================
//== CRUD Delete ==================================================================
function deleteNote(id) {
    console.log(id) // Passo 1: Receber o id da nota a ser excluida
    api.deleteNote(id) // Passo 2: enviar o id da nota ao main
}
//== FIM - CRUD Delete ============================================================
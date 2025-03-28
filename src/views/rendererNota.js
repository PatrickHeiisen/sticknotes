/**
 * Processo de Renderização do documento html
 */

// Para debugar  e testar a aplicação e necessario ativar as ferramentas de desenvolvedor
//console.log("teste")

// capturar o foco da caixa de texto
const foco = document.getElementById('inputNote')

// alterar as propriedades do documento html ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', () =>{
    foco.focus() //iniciar o documento com foco na caixa de texto
})

// capturar os dados do formulario (Passo 1: fluxo)
let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

//==================================================================
// == CRUD Create ==================================================

// Evento relacionado ao botão submit
frmNote.addEventListener('submit', async (event) => {
    // evitar o comportamento padrão (recarregar a pagina)
    event.preventDefault()
    // Importante (teste de recebimento dos dados do form - Passo 1)
    console.log(note.value, color.value)
    // criar um objeto para enviar para o main os dados da nota
    const stickyNote = {
        textNote: note.value,
        colorNote: color.value
    }
    // Enviar o objeto para o main (Passo 2: fluxo)
    api.createNote(stickyNote)
})

// == Fim - CRUD Create ============================================
//==================================================================


// ******************************************************************

// ******************************************************************

// === Resetar o Formulario =========================================
api.resetForm((args) => {
    // recarregar a pagina
    location.reload()
})

// === Fim - Resetar o formulario ===================================
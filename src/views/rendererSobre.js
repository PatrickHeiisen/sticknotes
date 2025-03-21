/**
 * Processo de renderização do documento sobre.html
 */

// enviar uma mensagem para o processo principal fechar a janela sobre
function fechar(){
    // Executar a função aboutExit() vinculada ao preload atraves da api do electron
    api.aboutExit()
}
/**
 * preload.js - Usado no framework electron para aumentar a segurança
 */

// Importação dos recursos do framework electron
// ipcrenderer permite uma comunicação entre processos main.js <-> renderer.js
// contextBridge: permissão de comunicação entre processos usando api
const {ipcRenderer, contextBridge} = require('electron')

// Enviar uma mensagem para main.js estabelecer uma conexão com o banco de dados quando iniciar a aplicação
// send (enviar)
// db-connect (indentificar a mensagem)
ipcRenderer.send('db-connect')

// permissões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld('api', {
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    aboutExit: () => ipcRenderer.send('about-exit'),
    createNote: (stickyNote) =>  ipcRenderer.send('create-note', stickyNote)
})

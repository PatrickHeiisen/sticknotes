/**
 * preload.js - Usado no framework electron para aumentar a segurança
 */

// Importação dos recursos do framework electron
// ipcrenderer permite uma comunicação entre processos main.js <-> renderer.js
// contextBridge: permissão de comunicação entre processos usando api
const {ipcRenderer, contextBridge} = require('electron')

// permissões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld('api', {
    dbConnect: () => ipcRenderer.send('db-connect'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    aboutExit: () => ipcRenderer.send('about-exit'),
    createNote: (stickyNote) =>  ipcRenderer.send('create-note', stickyNote),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    listNotes: () => ipcRenderer.send ('list-notes'),
    renderNotes: (notes) => ipcRenderer.on('render-notes', notes),
    updateList: () => ipcRenderer.send('update-list'),
    mainReload: (args) => ipcRenderer.on('main-reload', args)
})

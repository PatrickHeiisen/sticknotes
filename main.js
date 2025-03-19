console.log("Processo Principal")

// importação dos recursos do frame work
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos metodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// janela principal
let win
const createWindow = () => {
    // definindo o tema da janela claro ou escuro
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 1010,
        height: 720,
        //frame: false,
        //resizable: false,
        //minimizable: false,
        //closable: false,
        //autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Carregar o menu personalização
    // Antes importar o recurso menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    // carregar o documento html
    win.loadFile('./src/views/index.html')
}

// Janela Sobre
function aboutWindow() {
    nativeTheme.themeSource = 'light'
    // Obter a janela principal
    const mainwindow = BrowserWindow.getFocusedWindow()
    // Validação (se existir a janela principal)
    if (mainwindow) {
        about = new BrowserWindow({
            width: 320,
            height: 280,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            // estabelecer uma relçao hierarquica entre janelas
            parent: mainwindow,
            // criar uma janela modal (so retorna a principal quando encerrado)
            modal: true
        })
    }
    about.loadFile('./src/views/sobre.html')
}

// inicialização da aplicação (assincronismo)
app.whenReady().then(() => {
    createWindow()

    // melhor localç para estabelecer a conexão com o banco de dados
    // No MongoDB e mais eficiente manter uma unica conexão aberta durante todo o tempo de vida do aplicativo
    // ipcmain.on (receber mensagem)
    // db-connect (rotulo da mensagem)
    ipcMain.on('db-connect', async(event) => {
        // a linha a baixo estabelecer a conexão com o banco de dados
        await conectar()
        // enviar a o renderizador uma mensagem para trocar a imagem do icone do status do banco de dados
        setTimeout(() => {
            // enviar ao renderizador a mensagem "Conectado"
            // db-status (ipc - comunicação entre processos - proload.js)
            event.reply('db-status', "conectado")
        }, 500) //500ms = 0.5s
    })

    // so ativar a janela principal se nenhuma outra estiver ativa
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


// se o sistema não for mac encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// IMPORTANTE encerrar a conexão com o banco de dados quando a aplicação for encerrada
app.on('before-quit', async() => {
    await desconectar()
})

// Reduzir o verbozidade de tops não criticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

// template do menu
const template = [
    {
        label: 'Notas',
        submenu: [
            {
                label: 'Criar nota',
                accelerator: 'Ctrl+N',
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn',
            },
            {
                label: 'Reduzir',
                role: 'zoomOut',
            },
            {
                label: 'Restaurar Zoom padrão',
                role: 'resetZoom',
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'DevTools',
                role: 'toggleDevTools',
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositorio',
                click: () => shell.openExternal('https://github.com/PatrickHeiisen/sticknotes.git')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

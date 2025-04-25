console.log("Processo Principal")

// importação dos recursos do frame work
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

// Importação dos metodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')

// Importação dos modelos de dados (Notes.js)
const noteModel = require('./src/models/Nodes.js')

// janela principal
let win
const createWindow = () => {
    // definindo o tema da janela claro ou escuro
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 1080,
        height: 900,
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
            width: 300,
            height: 230,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            // estabelecer uma relçao hierarquica entre janelas
            parent: mainwindow,
            // criar uma janela modal (so retorna a principal quando encerrado)
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    about.loadFile('./src/views/sobre.html')

    // Rcebimento da mensagem de renderização da tela sobre
    ipcMain.on('about-exit', () => {
        // validação (se existir a janela e ela não estiver destruida)
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })
}

// Janela Notas
function noteWindow() {
    nativeTheme.themeSource = 'light'
    // Obter a janela principal
    const mainwindow = BrowserWindow.getFocusedWindow()
    // Validação (se existir a janela principal)
    if (mainwindow) {
        note = new BrowserWindow({
            width: 400,
            height: 300,
            autoHideMenuBar: true,
            //resizable: false,
            //minimizable: false,
            // estabelecer uma relçao hierarquica entre janelas
            parent: mainwindow,
            // criar uma janela modal (so retorna a principal quando encerrado)
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    note.loadFile('./src/views/nota.html')
}

// inicialização da aplicação (assincronismo)
app.whenReady().then(() => {
    createWindow()

    // melhor localç para estabelecer a conexão com o banco de dados
    // No MongoDB e mais eficiente manter uma unica conexão aberta durante todo o tempo de vida do aplicativo
    // ipcmain.on (receber mensagem)
    // db-connect (rotulo da mensagem)
    ipcMain.on('db-connect', async (event) => {
        // a linha a baixo estabelecer a conexão com o banco de dados everifica se foi conectado com sucesso 
        const conectado = await conectar()
        if (conectado) {
            // enviar a o renderizador uma mensagem para trocar a imagem do icone do status do banco de dados
            setTimeout(() => {
                // enviar ao renderizador a mensagem "Conectado"
                // db-status (ipc - comunicação entre processos - proload.js)
                event.reply('db-status', "conectado")
            }, 200) //500ms = 0.5s
        }
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
app.on('before-quit', async () => {
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
                click: () => noteWindow()
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
//==================================================================
// == CRUD Create ==================================================

// Recebimento do objeto que contem os dados da nota
ipcMain.on('create-note', async (event, stickyNote) => {
    // IMPORTANTE  teste de recebimento do objeto (Passo 2)
    console.log(stickyNote)
    try {
        // Criar uma nova estrutura de dados para salvar no banco
        // atenção os atributos da estrutura precisam ser identicos ao modelo e os valores sao obtidos atraves do stickyNote
        const newNote = noteModel({
            texto: stickyNote.textNote,
            cor: stickyNote.colorNote
        })
        // Salvar a nota no banco de dados (Passo 3)
        newNote.save()
        // Enviar ao renderizador um pedido para limpar os campos e setar o formulario com os padroes originais
        // usando o preload.js
        event.reply('reset-form')
    } catch (error) {
        console.log(error)
    }
})
// == Fim - CRUD Create ============================================
//==================================================================


//==================================================================
// == CRUD Create ==================================================

// Passo 2: Receber do renderer o pedido para listar as notas e fazer as buscas
ipcMain.on('list-notes', async (event) => {
    //console.log("Teste Ipc [list-notes]")
    try {
        // Passo 3: Obter do banco a listagem de notas cadastradas
        const notes = await noteModel.find()
        console.log(notes) // teste passo 3
        // Passo 4: Enviar ao renderer a listagem das notas
        // obs: IPC (string) | banco (json) e necessario uma conversão
        // event.reply resposta a solicitação (especifica do solicitante)
        event.reply('render-notes', JSON.stringify(notes))
    } catch (error) {
        console.log(error)
    }
})

// atualização das notas da janela principal
ipcMain.on('update-list', () => {
    // validação (se a janela principal existir e não tiver sido encerrada)
    if (win && !win.isDestroyed()){
        // enviar ao renderer.js um pedido para recarregar a pagina
        win.webContents.send('main-reload')
        // enviar novamente um pedido para troca do icone
        setTimeout(() => {
            win.webContents.send('db-status', "conectado")
        }, 200) // para garantir que o renderer esteja pronto
    }
})
// == Fim - CRUD Create ============================================
//==================================================================
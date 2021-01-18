//import { SparkManager } from './lib/spork/sparkManager';
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { SparkDeviceManager } from './spork/src/devices/spark/sparkDeviceManager';


try {
    require('electron-reloader')(module)
} catch (_) { }


let win: BrowserWindow;

const sendMessage = (type: string, msg: string) => {
    if (win) {
        win.webContents.send(type, msg);
    }
} 

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html');
}

const deviceManager = new SparkDeviceManager("08:EB:ED:8F:84:0B");

ipcMain.handle('perform-action', (event, args) => {
    // ... do actions on behalf of the Renderer
    console.log("got event from render:" + args.action);

    
    if (args.action == 'scan') {
        deviceManager.scanForDevices().then((devices)=>{
            console.log(JSON.stringify(devices));
        });
    }

    if (args.action == 'connect') {

        deviceManager.onStateChanged = (s: any) => {
            console.log("main.ts: device state changed")
            onDeviceStateChanged(s)
        };

        try {
            deviceManager.connect().then(connectedOk => {
                if (connectedOk) {
                    sendMessage("device-connection-changed", "connected")
                   
                    deviceManager.sendCommand("get_preset", 0);

                    //await deviceManager.sendPreset(preset1);
                } else {
                    sendMessage("device-connection-changed", "failed")
                }

            });
        } catch (e) {
            sendMessage("device-connection-changed", "failed")
        }
    }

    if (args.action == 'applyPreset') {
        deviceManager.sendCommand("set_preset", args.data);
    }


    if (args.action == 'getPreset') {
        deviceManager.sendCommand("get_preset", args.data);
    }

    if (args.action == 'setChannel') {
        deviceManager.sendCommand("set_channel", args.data);
    }

    if (args.action == 'setFxParam') {
        deviceManager.sendCommand("set_fx_param", args.data);
    }

    if (args.action == 'setFxToggle') {
        deviceManager.sendCommand("set_fx_onoff", args.data);
    }
})

function onDeviceStateChanged(deviceState: any) {
    sendMessage('device-state-changed', deviceState);
}

////////////////////////

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})



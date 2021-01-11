//import { SparkManager } from './lib/spork/sparkManager';
const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { SparkDeviceManager } = require("./lib/spork/devices/spark/sparkDeviceManager.js")

try {
    require('electron-reloader')(module)
} catch (_) { }


let win = null;


const sendMessage = (type, msg) => {
    if (win) {
        win.webContents.send(type, msg);
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
}

const deviceManager = new SparkDeviceManager("08:EB:ED:8F:84:0B");

ipcMain.handle('perform-action', (event, args) => {
    // ... do actions on behalf of the Renderer
    console.log("got event from render:" + args.action);

    if (args.action == 'connect') {

        deviceManager.onStateChanged = (s) => {
            onDeviceStateChanged(s)
        };

        deviceManager.connect().then(connectedOk => {
            if (connectedOk) {
                sendMessage("device-connection-changed", "connected")
                //const preset1 = { "Preset Number": [0x00, 0x7f], "UUID": "07079063-94A9-41B1-AB1D-02CBC5D00790", "Name": "Silver Ship", "Version": "0.7", "Description": "1-Clean", "Icon": "icon.png", "BPM": 120.0, "Pedals": [{ "Name": "bias.noisegate", "OnOff": "Off", "Parameters": [0.138313, 0.224643, 0.000000] }, { "Name": "LA2AComp", "OnOff": "On", "Parameters": [0.000000, 0.852394, 0.373072] }, { "Name": "Booster", "OnOff": "Off", "Parameters": [0.722592] }, { "Name": "RolandJC120", "OnOff": "On", "Parameters": [0.632231, 0.281820, 0.158359, 0.671320, 0.805785] }, { "Name": "Cloner", "OnOff": "On", "Parameters": [0.199593, 0.000000] }, { "Name": "VintageDelay", "OnOff": "Off", "Parameters": [0.378739, 0.425745, 0.419816, 1.000000] }, { "Name": "bias.reverb", "OnOff": "On", "Parameters": [0.285714, 0.408354, 0.289489, 0.388317, 0.582143, 0.650000, 0.200000] }], "End Filler": 0xb4 }
                deviceManager.sendCommand("get_preset", 0);

                //await deviceManager.sendPreset(preset1);
            } else {
                sendMessage("device-connection-changed", "failed")
            }

        });
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
})

function onDeviceStateChanged(stateInfo) {
    sendMessage('device-state-changed', stateInfo);
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



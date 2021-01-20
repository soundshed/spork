//import { SparkManager } from './lib/spork/sparkManager';
import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { SparkDeviceManager } from './spork/src/devices/spark/sparkDeviceManager';
import installExtension, { REACT_DEVELOPER_TOOLS  } from 'electron-devtools-installer';


try {
    require('electron-reloader')(module)
} catch (_) { }


let win: BrowserWindow;

const sendMessageToApp = (type: string, msg: string) => {
    if (win) {
        // send message to be handled by the UI/app (appViewModel)
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

const deviceManager = new SparkDeviceManager();

deviceManager.onStateChanged = (s: any) => {
    console.log("main.ts: device state changed")
    sendMessageToApp('device-state-changed', s);
};

ipcMain.handle('perform-action', (event, args) => {
    // ... do actions on behalf of the Renderer
    console.log("got event from render:" + args.action);

    if (args.action == 'scan') {
        deviceManager.scanForDevices().then((devices) => {
            console.log(JSON.stringify(devices));

            sendMessageToApp('devices-discovered', devices);
        });
    }

    if (args.action == 'connect') {
        console.log("attempting to connect:: " + JSON.stringify(args));

        try {
            deviceManager.connect(args.data).then(connectedOk => {
                if (connectedOk) {
                    sendMessageToApp("device-connection-changed", "connected")

                    deviceManager.sendCommand("get_preset", 0);

                    //await deviceManager.sendPreset(preset1);
                } else {
                    sendMessageToApp("device-connection-changed", "failed")
                }

            });
        } catch (e) {
            sendMessageToApp("device-connection-changed", "failed")
        }
    }

    if (args.action == 'applyPreset') {
        let p = { "Preset Number": [0x00, 0x7f], "UUID": "D99DC07A-C997-4ABD-833A-0C13EA8BEE5A", "Name": "Comped Cleaner", "Version": "0.7", "Description": "Description for Bass Preset 1", "Icon": "icon.png", "BPM": 120.0, "Pedals": [{ "Name": "bias.noisegate", "OnOff": "On", "Parameters": [0.205729, 0.226562] }, { "Name": "BassComp", "OnOff": "On", "Parameters": [0.193040, 0.334991] }, { "Name": "MaestroBassmaster", "OnOff": "Off", "Parameters": [0.698052, 0.276184, 0.566086] }, { "Name": "GK800", "OnOff": "On", "Parameters": [0.688351, 0.407152, 0.399197, 0.746875, 0.774234] }, { "Name": "Cloner", "OnOff": "Off", "Parameters": [0.248888, 0.000000] }, { "Name": "DelayMono", "OnOff": "Off", "Parameters": [0.163333, 0.214724, 0.355828, 0.320000, 1.000000] }, { "Name": "bias.reverb", "OnOff": "On", "Parameters": [0.168478, 0.744565, 0.130435, 0.288043, 0.323370, 0.293478, 0.600000] }], "End Filler": 0x54 };

        // send preset
        deviceManager.sendCommand("set_preset", p);

        setTimeout(()=>{
                //apply preset to virtual channel 127
                deviceManager.sendCommand("set_channel", 127);
        },500);
        //deviceManager.sendCommand("set_preset_from_model", args.data);
    }

    if (args.action == 'getDeviceName') {
        deviceManager.sendCommand("get_device_name", {});
    }

    if (args.action == 'getDeviceSerial') {
        deviceManager.sendCommand("get_device_serial", {});
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

    if (args.action == 'changeFx') {
        deviceManager.sendCommand("change_fx", args.data);
    }

    if (args.action == 'changeAmp') {
        deviceManager.sendCommand("change_amp", args.data);
    }
})


////////////////////////

app.whenReady().then(()=>{
    
    /*installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));*/

    createWindow();
});

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



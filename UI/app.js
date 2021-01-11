// note that the fs package does not exist on a normal browser
const { fs, ipcRenderer, ipcMain } = require("electron");

const PresetsManager = require("./core/presetsManager.js").PresetsManager;

const getElement = (id) => {
  return document.getElementById(id);
}

const log = (msg) => {
  console.log(msg);
}

const uiState = {
  connected: false,
  deviceName: "",
  deviceAddress: ""
}



let presets = new PresetsManager().getAllPresets();

const setupUIActions = () => {
  getElement("connect").addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'connect' })
  });


  getElement("applyPreset").addEventListener("click", () => {
    let presetNumber = Math.floor(Math.random() * presets.length);

    getElement("status").innerText = "Applying preset " + presets[presetNumber].Name;

    ipcRenderer.invoke('perform-action', { action: 'applyPreset', data: presets[presetNumber] })
  });

  getElement("ch1").addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 0 })
  });
  getElement("ch2").addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 1 })
  });
  getElement("ch3").addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 2 })
  });
  getElement("ch4").addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 3 })
  });

}

ipcRenderer.on('device-state-changed', (event, args) => {
  log("got device state update from main:" + args);
  getElement("state").innerText = JSON.stringify(args)
});

ipcRenderer.on('device-connection-changed', (event, args) => {

  log("got connection event from main:" + args);

  getElement("status").innerText = JSON.stringify(args)

  if (args == "connected") {
    uiState.connected = true;
  }

  if (args == "failed") {
    uiState.connected = false;
  }
});


setupUIActions();
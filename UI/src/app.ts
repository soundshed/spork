import { ipcRenderer, ipcMain } from 'electron';
import { PresetsManager } from './core/presetsManager';

const getElement = (id: string) => {
  return document.getElementById(id);
}

const log = (msg: string) => {
  console.log(msg);
}

const uiState = {
  connected: false,
  deviceName: "",
  deviceAddress: ""
}


let presets = new PresetsManager().getAllPresets();

const setupUIActions = () => {
  getElement("connect")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'connect' })
  });


  getElement("applyPreset")?.addEventListener("click", () => {
    let presetNumber = Math.floor(Math.random() * presets.length);

    setElementText('status',  "Applying preset " + presets[presetNumber].Name);

    ipcRenderer.invoke('perform-action', { action: 'applyPreset', data: presets[presetNumber] })
  });


  getElement("getPreset")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'getPreset', data: 0 })
  });

  getElement("ch1")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 0 })
  });
  getElement("ch2")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 1 })
  });
  getElement("ch3")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 2 })
  });
  getElement("ch4")?.addEventListener("click", () => {
    ipcRenderer.invoke('perform-action', { action: 'setChannel', data: 3 })
  });

}

/*
ipcRenderer.on('device-state-changed', (event, args) => {
  log("got device state update from main:" + args);
  setElementText('state', JSON.stringify(args));
});
*/
ipcRenderer.on('device-connection-changed', (event, args) => {

  log("got connection event from main:" + args);

  setElementText('status', JSON.stringify(args));

  if (args == "connected") {
    uiState.connected = true;
  }

  if (args == "failed") {
    uiState.connected = false;
  }
});

function setElementText(id: string, msg: string) {
  const el = getElement(id);
  if (el) {
    el.innerText = msg;
  }
}

//setupUIActions();
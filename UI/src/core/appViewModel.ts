import { ipcRenderer } from 'electron';
import { Preset } from '../spork/src/interfaces/preset';

const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
        const boundFunc = func.bind(this, ...args);
        clearTimeout(timerId);
        timerId = setTimeout(boundFunc, delay);
    }
}

export class AppViewModel {

    public isConnected: boolean = false;
    public preset: Preset = {};
    public selectedChannel: number = 1;
    public messages = [];
    public statusMessage = "";
    private onStateChangeHandler;

    private debouncedFXUpdate;

    constructor() {
        this.setupElectronIPCListeners();
    }

    addStateChangeListener(onViewModelStateChange) {
        this.onStateChangeHandler = onViewModelStateChange;
    }

    removeStateChangeListener() {
        this.onStateChangeHandler = null;
    }

    setupElectronIPCListeners() {
        // setup event listeners for main electron app events (native bluetooth data state etc)
        ipcRenderer.on('device-state-changed', (event, args) => {
            this.log("got device state update from main.");

            if (args.presetConfig) {
                this.preset = args.presetConfig;


            }

            if (args.lastMessageReceived) {
                this.messages.push(args.lastMessageReceived);
            }

            this.onStateChangeHandler();
        });

        ipcRenderer.on('device-connection-changed', (event, args) => {

            this.log("got connection event from main:" + args);

            if (args == "connected") {
                this.isConnected = true;
            }

            if (args == "failed") {
                this.isConnected = false;
            }

            this.onStateChangeHandler();
        });
    }

    log(msg: string) {
        console.log(msg);
    }

    async scanForDevices(): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'scan' });
        return true;
    }


    async connectDevice(): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'connect' });
        return true;
    }

    async requestPresetConfig(): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'getPreset', data: 0 }).then(
            () => {
                this.log("Completed preset query");
            });
        return true;
    }


    async requestFxParamChangeImmediate(args) {
        return ipcRenderer.invoke('perform-action', { action: 'setFxParam', data: args }).then(
            () => {

            });
        return true;
    }

    async requestFxParamChange(args): Promise<boolean> {

        if (this.debouncedFXUpdate == null) {
            this.debouncedFXUpdate = debounce((args) => this.requestFxParamChangeImmediate(args), 250);
        }

        this.debouncedFXUpdate(args);

        return true;
    }


    async requestFxToggle(args): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'setFxToggle', data: args }).then(
            () => {
                this.log("Sent fx toggle change");
            });
        return true;
    }
    async setChannel(channelNum: number): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'setChannel', data: channelNum }).then(
            () => {
                this.log("Completed preset query");
            });
        return true;
    }
}

export default AppViewModel;
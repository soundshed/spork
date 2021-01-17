import { ipcRenderer } from 'electron';
import { Preset } from '../spork/src/interfaces/preset';

export class AppViewModel {

    public isConnected: boolean = false;
    public preset: Preset = {};
    public selectedChannel:number = 1;
    public messages = [];
    public statusMessage = "";
    private onStateChangeHandler;

    constructor(onStateChangeHandler) {
        this.onStateChangeHandler = onStateChangeHandler;

        this.setupElectronIPCListeners();
    }

    setupElectronIPCListeners() {
        // setup event listeners for main electron app events (native bluetooth data state etc)
        ipcRenderer.on('device-state-changed', (event, args) => {
            this.log("got device state update from main:" + JSON.stringify(args));

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

    async setChannel(channelNum:number): Promise<boolean> {
        await ipcRenderer.invoke('perform-action', { action: 'setChannel', data: channelNum }).then(
            () => {
                this.log("Completed preset query");
            });
        return true;
    }
}

export default AppViewModel;
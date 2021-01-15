import { ipcRenderer } from 'electron';
import { Preset } from '../spork/src/interfaces/preset';

export class AppViewModel {

    public isConnected: boolean = false;
    public preset: Preset = {};

    constructor() {
        ipcRenderer.on('device-state-changed', (event, args) => {
            this.log("got device state update from main:" + args);

            if (args.presetConfig) {
                this.preset = args.presetConfig;
            }
            // setPresetConfig(viewModel.)
        });
    }

    log(msg: string) {
        console.log(msg);
    }

    async connectDevice(): Promise<boolean> {


        await ipcRenderer.invoke('perform-action', { action: 'connect' });

        return true;
    }

    getCurrentPresetState() {
        return this.preset;
    }

}

export default AppViewModel;
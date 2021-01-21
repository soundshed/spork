import { ipcRenderer } from 'electron';
import { BluetoothDeviceInfo } from '../spork/src/interfaces/deviceController';

import { FxChangeMessage, Preset } from '../spork/src/interfaces/preset';

export class AppViewModel {

    public storedPresets: Preset[] = [];

    constructor() {
       
    }

    log(msg: string) {
        console.log(msg);
    }


    loadFavourites():Preset[] {
        let favourites: Preset[] = [];
        let allPresets = localStorage.getItem("favourites");
        if (allPresets != null) {
            favourites = JSON.parse(allPresets);
        }

        this.storedPresets = favourites;

        return this.storedPresets;

    }

    async storeFavourite(preset: Preset): Promise<boolean> {

        if (preset != null) {
            let favourites: Preset[] = [];
            let allPresets = localStorage.getItem("favourites");
            if (allPresets != null) {
                favourites = JSON.parse(allPresets);
            }

            favourites.push(preset);
            localStorage.setItem("favourites", JSON.stringify(favourites));

            this.storedPresets = favourites;

            return true;
        }
        else {
            return false;
        }

    }
}

export default AppViewModel;
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sparkManager_1 = require("../sparkManager");
let sm = new sparkManager_1.SparkManager();
sm.connect().then((connectedOk) => __awaiter(this, void 0, void 0, function* () {
    if (connectedOk) {
        const preset1 = { "Preset Number": [0x00, 0x7f], "UUID": "07079063-94A9-41B1-AB1D-02CBC5D00790", "Name": "Silver Ship", "Version": "0.7", "Description": "1-Clean", "Icon": "icon.png", "BPM": 120.0, "Pedals": [{ "Name": "bias.noisegate", "OnOff": "Off", "Parameters": [0.138313, 0.224643, 0.000000] }, { "Name": "LA2AComp", "OnOff": "On", "Parameters": [0.000000, 0.852394, 0.373072] }, { "Name": "Booster", "OnOff": "Off", "Parameters": [0.722592] }, { "Name": "RolandJC120", "OnOff": "On", "Parameters": [0.632231, 0.281820, 0.158359, 0.671320, 0.805785] }, { "Name": "Cloner", "OnOff": "On", "Parameters": [0.199593, 0.000000] }, { "Name": "VintageDelay", "OnOff": "Off", "Parameters": [0.378739, 0.425745, 0.419816, 1.000000] }, { "Name": "bias.reverb", "OnOff": "On", "Parameters": [0.285714, 0.408354, 0.289489, 0.388317, 0.582143, 0.650000, 0.200000] }], "End Filler": 0xb4 };
        yield sm.sendPreset(preset1);
        yield sm.readStateMessage();
    }
    while (connectedOk) {
    }
}));
//# sourceMappingURL=sparkManagerTest.js.map
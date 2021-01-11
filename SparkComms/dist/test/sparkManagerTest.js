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
const sparkDeviceManager_1 = require("../devices/spark/sparkDeviceManager");
let sm = new sparkDeviceManager_1.SparkDeviceManager("08:EB:ED:8F:84:0B");
sm.connect().then((connectedOk) => __awaiter(this, void 0, void 0, function* () {
    if (connectedOk) {
        yield sm.sendCommand("get_preset", 1);
    }
})).then(() => {
});
//# sourceMappingURL=sparkManagerTest.js.map
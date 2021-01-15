import { SparkDeviceManager } from "../devices/spark/sparkDeviceManager";

let sm = new SparkDeviceManager("08:EB:ED:8F:84:0B");

sm.connect().then(async connectedOk => {
    if (connectedOk) {
        await sm.sendCommand("get_preset", 1);
    }

}).then(() => {


});



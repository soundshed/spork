import { DeviceController, BluetoothDeviceInfo } from "../../interfaces/deviceController";
import { DeviceState, FxCatalogItem } from "../../interfaces/preset";
import { SparkCommandMessage } from "./sparkCommandMessage";
import { FxCatalogProvider } from "./sparkFxCatalog";
import { SparkMessageReader } from "./sparkMessageReader";

export class SparkDeviceManager implements DeviceController {
    private btSerial;

    private latestStateReceived = [];
    private stateInfo: any;

    public onStateChanged;
    private lastStateTime = new Date().getTime()

    public deviceAddress = "";

    private reader = new SparkMessageReader();



    constructor() {

        this.btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

        this.btSerial.on('data', (buffer) => {

            let currentTime = new Date().getTime();
            let timeDelta = currentTime - this.lastStateTime;
            this.lastStateTime = currentTime;

            this.latestStateReceived.push(buffer);


            if (buffer[buffer.length - 1] == 0xf7) {
                // end message 
                this.readStateMessage();

                this.log('Receive last message in batch, processing message ' + this.latestStateReceived.length);

                //this.log(JSON.stringify(this.reader.deviceState))

                this.latestStateReceived = [];
            }

        });
    }

    public async scanForDevices(): Promise<any> {

        

        return new Promise((resolve, reject) => {

            let resolutionTimeout;

            let devices: BluetoothDeviceInfo[] = [];
            // find bluetooth devices, identify spark devices and capture the device address and name. 
            // On each discovery, clear the resolution timeout so that the last item is the one that completes.
            this.btSerial.on('found', (address: string, name: string) => {
                this.log("addr:" + JSON.stringify(address) + " name:" + name)

                if (name == "Spark 40 Audio") {

                    address = address.replace(name, "").replace("(", "").replace(")", "");
                    if (!devices.find(d=>d.address==address))
                    {
                        devices.push({ name: name, address: address, port: 2 });
                    }
                   
                }

                if (resolutionTimeout) {
                    clearTimeout(resolutionTimeout);
                }

                resolutionTimeout = setTimeout(() =>
                    resolve(devices)
                    , 500);

            });

            try {
                this.btSerial.inquire();

            } catch {
                reject();
            }




        });
    }

    public async connect(device: BluetoothDeviceInfo): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.btSerial.connect(device.address, device.port, () => {
                this.log('bluetooth device connected: ' + device.name);

                resolve(true);

            }, () => {
                this.log(`cannot connect to device [${device.address} ${device.name}]`);

                if (this.onStateChanged) {
                    this.onStateChanged({ type: "connection", status: "failed" });
                } else {
                    this.log("No onStateChange handler defined.")
                }

                reject(false);
            });

        })
    }

    public async disconnect() {
        if (this.btSerial) {
            this.btSerial.close();
        }
    }

    private buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    public async readStateMessage() {

        this.log("Reading state message"); //+ this.buf2hex(this.latestStateReceived));


        let reader = this.reader;

        reader.set_message(this.latestStateReceived);


        let b = reader.read_message();

        this.stateInfo = reader.text;

        this.hydrateDeviceStateInfo(reader.deviceState);

        if (this.onStateChanged) {
            this.onStateChanged(reader.deviceState);
        } else {
            this.log("No onStateChange handler defined.")
        }
    }

    private hydrateDeviceStateInfo(deviceState: DeviceState) {
        let fxCatalog = FxCatalogProvider.db;

        // populate metadata about fx etc
        if (deviceState.presetConfig) {
            for (let fx of deviceState.presetConfig.sigpath) {
                let dsp = fxCatalog.catalog.find(f => f.dspId == fx.dspId);
                if (dsp != null) {
                    fx.type = dsp.type;
                    fx.name = dsp.name;
                    fx.description = dsp.description;

                    for (let p of fx.params) {
                        let paramInfo = dsp.params.find(pa => pa.index == p.index);
                        if (paramInfo) {
                            p.name = paramInfo.name;
                        }
                    }
                } else {
                    fx.name = fx.dspId;
                    fx.description = "(No description)";

                    for (let p of fx.params) {
                        if (p != null) {
                            p.name = "Param " + p.index.toString();
                        }
                    }
                }
            }
        }
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    public async sendCommand(type, data) {

        this.log("sending command");

        let msg = new SparkCommandMessage();

        let msgArray = [];

        if (type == "set_preset") {
            msgArray = msg.create_preset(data);
        }

        if (type == "set_channel") {
            msgArray = msg.change_hardware_preset(data);
        }

        if (type == "set_fx_onoff") {
            this.log("Toggling Effect " + JSON.stringify(data));
            msgArray = msg.turn_effect_onoff(data.dspId, data.value == 1 ? "On" : "Off");

        }

        if (type == "set_fx_param") {
            this.log("Changing Effect Param " + JSON.stringify(data));
            msgArray = msg.change_effect_parameter(data.dspId, data.index, data.value);
        }

        if (type == "get_preset") {
            msgArray = msg.request_preset_state();
        }

        if (type == "get_devicename") {
            msgArray = msg.request_info(0x23);
        }

        for (let msg of msgArray) {
            this.btSerial.write(Buffer.from(msg), (err, bytesWritten) => {
                if (err) this.log(err);
            });
            await this.sleep(100);
        }

    }

    private log(msg) {
        console.log("[Spark Device Manager] : " + msg);
    }

    public getFxCatalog() {


        let fxCatalog: Array<FxCatalogItem> = [
            // noise gate
            {

                type: "gate", dspId: "bias.noisegate", name: "Noise Gate", params: [
                    { index: 0, value: 0.2, name: "Threshold" },
                    { index: 1, value: 0.05, name: "Decay" },
                    { index: 2, value: 1, name: "On/Off", type: "switch" },

                ]
            },
            // amps
            {

                type: "amp", dspId: "94MatchDCV2", name: "94MatchDCV2 Comp", params: [
                    { index: 0, value: 0.5, name: "Gain" },
                    { index: 1, value: 0.3, name: "Bass" },
                    { index: 2, value: 0.4, name: "Middle" },
                    { index: 3, value: 0.4, name: "Treble" },
                    { index: 4, value: 0.7, name: "Volume" },

                ],
            },
            // comp
            {

                type: "comp", dspId: "BBEOpticalComp", name: "Optical Comp", params: [
                    { index: 0, value: 0.6, name: "Volume (-/+ 6dB)" },
                    { index: 1, value: 0.4, name: "Comp" },
                    { index: 2, value: false, name: "Pad (0dB/15dB)_" }
                ]
            },
            // drive
            {

                type: "drive", dspId: "DistortionTS9", name: "Tube Drive", params: [
                    { index: 0, value: 0.5, name: "Overdrive" },
                    { index: 1, value: 0.5, name: "Tone" },
                    { index: 2, value: 0.6, name: "Level" }
                ]
            },
            //reverb

            {

                type: "reverb", dspId: "bias.reverb", name: "Ambient", params: [
                    { name: "Level", index: 0, value: 0.8 },
                    { name: "Damping", index: 1, value: 0.2 },
                    { name: "Low Cut", index: 2, value: 0.8 },
                    { name: "High Cut", index: 3, value: 0.7 },
                    { name: "Dwell", index: 4, value: 0.3 },
                    { name: "Time", index: 5, value: 0.5 }
                ]
            }


        ];



        return fxCatalog;
    }

}
import { DeviceController } from "../../interfaces/deviceController";
import { FxCatalogItem } from "../../interfaces/preset";
import { SparkCommandMessage } from "./sparkCommandMessage";
import { SparkMessageReader } from "./sparkMessageReader";

export class SparkDeviceManager implements DeviceController {
    private btSerial;

    private latestStateReceived = [];
    private stateInfo: any;

    public onStateChanged;
    private lastStateTime = new Date().getTime()

    public deviceAddress = "";

    private reader = new SparkMessageReader();

    constructor(deviceAddress) {
        this.deviceAddress = deviceAddress
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

                this.log(JSON.stringify(this.reader.deviceState))

                this.readStateMessage();
                this.latestStateReceived = [];
            }

        });
    }

    public async connect(): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.btSerial.connect(this.deviceAddress, 2, () => {
                this.log('bluetooth device connected');

                resolve(true);

            }, () => {
                this.log('cannot connect');
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

        this.log("Reading state message:" + this.buf2hex(this.latestStateReceived));


        let reader = this.reader;

        reader.set_message(this.latestStateReceived);


        let b = reader.read_message();

        this.log(reader.text);

        this.stateInfo = reader.text;

        if (this.onStateChanged) {
            this.onStateChanged(this.stateInfo);
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
        if (type == "set_fx") {
            //msgArray = msg.change_effect(data);
        }
        if (type == "set_fx_param") {
            //msgArray = msg.change_effect_parameter(data);
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
        console.log(msg);
    }

    public getFxCatalog() {

        let fxCatalog: Array<FxCatalogItem> = [
            // amps
            {

                type: "speaker_fx", dspId: "94MatchDCV2", name: "94MatchDCV2 Comp", params: [
                    { index: 0, value: 0.5, name: "Gain" },
                    { index: 1, value: 0.3, name: "Bass" },
                    { index: 2, value: 0.4, name: "Middle" },
                    { index: 3, value: 0.4, name: "Treble" },
                    { index: 4, value: 0.7, name: "Volume" },

                ],
            },
            // comp
            {

                type: "speaker_fx", dspId: "BBEOpticalComp", name: "Optical Comp", params: [
                    { index: 0, value: 0.6, name: "Volume (-/+ 6dB)" },
                    { index: 1, value: 0.4, name: "Comp" },
                    { index: 2, value: false, name: "Pad (0dB/15dB)_" }
                ]
            }

        ];



        return fxCatalog;
    }

}
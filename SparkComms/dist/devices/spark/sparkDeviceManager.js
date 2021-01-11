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
const sparkCommandMessage_1 = require("./sparkCommandMessage");
const sparkMessageReader_1 = require("./sparkMessageReader");
class SparkDeviceManager {
    constructor(deviceAddress) {
        this.latestStateReceived = [];
        this.lastStateTime = new Date().getTime();
        this.deviceAddress = "08:EB:ED:8F:84:0B";
        this.deviceAddress = deviceAddress;
        this.btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
        this.btSerial.on('data', (buffer) => {
            let currentTime = new Date().getTime();
            let timeDelta = currentTime - this.lastStateTime;
            this.lastStateTime = currentTime;
            if (timeDelta > 100) {
                this.log('Receive: Starting new message batch');
                // new batch
                this.latestStateReceived = [];
            }
            else {
                // current batch
                this.log('Receive: Adding to message batch');
            }
            this.latestStateReceived.push(buffer);
            setTimeout(() => {
                if (this.latestStateReceived.length > 0) {
                    // process last message batch
                    this.log('Receive: Processing message batch ' + this.latestStateReceived.length);
                    this.readStateMessage();
                    this.latestStateReceived = [];
                }
            }, 500);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            /* var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
     
             btSerial.on('found', function (address, name) {
                 console.log("addr:" + address + " name:" + name)
             
                 if (name == "Spark 40 Audio") {
                     console.log("Connecting to spark..");
                     address = "F7:EB:ED:2F:75:BA";
             
                     btSerial.findSerialPortChannel(address, function (channel) {
                         btSerial.connect(address, channel, function () {
                             console.log('connected');
             
                             btSerial.write(Buffer.from('my data', 'utf-8'), function (err, bytesWritten) {
                                 if (err) console.log(err);
                             });
             
                             btSerial.on('data', function (buffer) {
                                 console.log(buffer.toString('utf-8'));
                             });
                         }, function () {
                             console.log('cannot connect');
                         });
             
                         // close the connection when you're ready
                         btSerial.close();
                     }, function () {
                         console.log('found nothing');
                     });
                 }
             });
             */
            //btSerial.inquire();
            return new Promise((resolve, reject) => {
                this.btSerial.connect(this.deviceAddress, 2, () => {
                    this.log('bluetooth device connected');
                    resolve(true);
                }, () => {
                    this.log('cannot connect');
                    reject(false);
                });
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.btSerial) {
                this.btSerial.close();
            }
        });
    }
    buf2hex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
    readStateMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("Reading state message:" + this.buf2hex(this.latestStateReceived));
            let reader = new sparkMessageReader_1.SparkMessageReader();
            reader.set_message(this.latestStateReceived);
            let b = reader.read_message();
            this.log(reader.text);
            this.stateInfo = reader.text;
            if (this.onStateChanged) {
                this.onStateChanged(this.stateInfo);
            }
        });
    }
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    sendCommand(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("sending command");
            let msg = new sparkCommandMessage_1.SparkCommandMessage();
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
            for (let msg of msgArray) {
                this.btSerial.write(Buffer.from(msg), (err, bytesWritten) => {
                    if (err)
                        this.log(err);
                });
                yield this.sleep(100);
            }
            //thisbtSerial.close();
        });
    }
    log(msg) {
        console.log(msg);
    }
}
exports.SparkDeviceManager = SparkDeviceManager;
//# sourceMappingURL=sparkDeviceManager.js.map
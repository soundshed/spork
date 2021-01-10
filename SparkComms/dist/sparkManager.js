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
const sparkMessage_1 = require("./sparkMessage");
const sparkMessageReader_1 = require("./sparkMessageReader");
class SparkManager {
    constructor() {
        this.btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
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
                this.btSerial.connect("08:EB:ED:8F:84:0B", 2, () => {
                    console.log('connected');
                    this.btSerial.on('data', (buffer) => {
                        this.latestStateReceived = buffer;
                        //console.log("Received state::");
                        //console.log(buffer.toString('utf-8'));
                        this.readStateMessage();
                    });
                    //resolve(true);
                }, () => {
                    console.log('cannot connect');
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
    readStateMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            let reader = new sparkMessageReader_1.SparkReadMessage();
            reader.set_message(this.latestStateReceived);
            let b = reader.read_message();
            console.log(reader.text);
        });
    }
    sendPreset(preset) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("send preset");
            let msg = new sparkMessage_1.SparkMessage();
            let msgArray = msg.create_preset(preset);
            for (let msg of msgArray) {
                this.btSerial.write(Buffer.from(msg), (err, bytesWritten) => {
                    if (err)
                        console.log(err);
                });
            }
        });
    }
}
exports.SparkManager = SparkManager;
//# sourceMappingURL=sparkManager.js.map
import { SparkMessage } from "./sparkMessage";
import { SparkReadMessage } from "./sparkMessageReader";

export class SparkManager {
    private btSerial;

    private latestStateReceived;

    constructor() {
        this.btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
    }

    public async connect(): Promise<boolean> {

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

                this.btSerial.on('data',  (buffer) =>{

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

        })
    }

    public async disconnect() {
        if (this.btSerial) {
            this.btSerial.close();
        }
    }

    public async readStateMessage() {
        let reader = new SparkReadMessage();
        reader.set_message(this.latestStateReceived);
        let b = reader.read_message();
        console.log(reader.text);
        
    }

    public async sendPreset(preset) {
        console.log("send preset");

      
        let msg = new SparkMessage();
        let msgArray = msg.create_preset(preset);
        for (let msg of msgArray) {
            this.btSerial.write(Buffer.from(msg), (err, bytesWritten) => {
                if (err) console.log(err);
            });
        }

    }
}
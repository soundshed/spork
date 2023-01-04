
class BluetoothService {

  isDeviceQueryInProgress = false;
  progressMsg = "";

  constructor() {
    /// npx http-server . --ssl -K C:/Work/Misc/ssl/localhost-key.pem -C C:/Work/Misc/ssl/localhost.pem
  }

  _log = "";

  log(msg) {
    console.log(msg);
    this._log += msg + "\r\n";

    document.getElementById("log").value = this._log;
  }

  async GetSettings() {

    let deviceInfo = {};
    let browser = navigator;
    this.isDeviceQueryInProgress = true;

    const serviceGenericUUID = '00001800-0000-1000-8000-00805f9b34fb'; // service 'generic_access'
    const serviceCustomUUID = '0000ffc0-0000-1000-8000-00805f9b34fb'; // service '65472'

    const cmdCharacteristicId = '0xffc1'; //0x0000ffc1-0000-1000-8000-00805f9b34fb
    const changeCharacteristicId = '0xffc2'; //0x0000ffc2-0000-1000-8000-00805f9b34fb

    const options = { acceptAllDevices: true, optionalServices: [serviceGenericUUID, serviceCustomUUID] };

    try {
      this.log('Requesting Bluetooth Device...');
      this.log('with ' + JSON.stringify(options));

      this.progressMsg = "Requesting device..";

      const device = await browser.bluetooth.requestDevice(options);

      deviceInfo.deviceName = device.name;
      deviceInfo.deviceId = device.id;

      this.log('> Name:             ' + device.name);
      this.log('> Id:               ' + device.id);
      this.log('> Connected:        ' + device.gatt.connected);

      this.progressMsg = "Connecting..";

      // connect to device gatt service
      const server = await device.gatt.connect();

      this.progressMsg = "Getting Device Service..";

      const service = await server.getPrimaryService(serviceCustomUUID);

      // generic access service:
      // 00002a00-0000-1000-8000-00805f9b34fb : device name
      // 00002a04-0000-1000-8000-00805f9b34fb : peripheral parameters

      // 65472 [0000ffc0-0000-1000-8000-00805f9b34fb] service
      // characteristic name: 65474 (0xFFC2), handle  7
      // characteristic name: 65473 (0xFFC1), handle  10

      this.progressMsg = "Getting Device Characteristic..";

      const changeCharacteristic = await service.getCharacteristic(parseInt(changeCharacteristicId));

      changeCharacteristic.addEventListener('characteristicvaluechanged',
        (event) => {
          this.log(this.buf2hex(event.target.value.buffer));
        });

      changeCharacteristic.startNotifications();

      const cmdCharacteristic = await service.getCharacteristic(parseInt(cmdCharacteristicId));

      // loop through changing preset channel then requesting preset info
      for (let x = 0; x <= 3; x++) {

        // set preset
        this.log(`Setting Preset ${x}`)
        let cmd = `01fe000053fe1a000000000000000000f0013a15013800000${x}f7`;
        let data = new Uint8Array(this.hexToBytes(cmd));
        await cmdCharacteristic.writeValueWithoutResponse(data);
        await this.sleepAsync(2000);

        // get preset
        this.log(`Getting Preset ${x}`)
        cmd = `01fe000053fe1b000000000000000000f0013a1502010000000${x}f7`;
        data = new Uint8Array(this.hexToBytes(cmd));
        await cmdCharacteristic.writeValueWithoutResponse(data);
        await this.sleepAsync(1000);

      }

      await device.gatt.disconnect();

      this.progressMsg = "Completed";

    } catch (error) {
      this.log('Argh! ' + error);
      this.progressMsg = error;
    }

    this.isDeviceQueryInProgress = false;

    return deviceInfo;
  }

  hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  buf2hex(buffer) {
    // https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

  async sleepAsync(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

}
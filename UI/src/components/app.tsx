import * as React from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as ReactDOM from "react-dom";

import SignalPathControl from "./signal-path";
import DeviceControls from "./device-controls";
import MiscControls from "./misc-controls";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/styles.css";
import AppViewModel from "../core/appViewModel";
import { BluetoothDeviceInfo } from "../spork/src/interfaces/deviceController";

import { useEffect } from "react";
import { Preset } from "../spork/src/interfaces/preset";

let viewModel: AppViewModel = new AppViewModel();

const App = () => {
  const onViewModelStateChange = () => {
    setCurrentPreset(viewModel.preset);
    setConnected(viewModel.isConnected);
    setDevices(viewModel.devices);
    setFavourites(viewModel.storedPresets);
  };

  useEffect(() => {
    if (viewModel) {
      viewModel.addStateChangeListener(onViewModelStateChange);
      console.log("view model attached");
    }

    return () => {
      viewModel.removeStateChangeListener();

      console.log("view model removed");
    };
  }, []);

  // connection state

  const [connectionInProgress, setConnectionInProgress] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [currentPreset, setCurrentPreset] = React.useState({});
  const [devices, setDevices] = React.useState<BluetoothDeviceInfo[]>([]);
  const [deviceScanInProgress, setDeviceScanInProgress] = React.useState(false);
  const [selectedChannel, setSelectedChannel] = React.useState(
    viewModel.selectedChannel
  );
  const [presetConfig, setPresetConfig] = React.useState({});
  const [favourites, setFavourites]= React.useState(viewModel.storedPresets);

  const [
    selectedDevice,
    setSelectedDevice,
  ] = React.useState<BluetoothDeviceInfo>(null);

  const requestScanForDevices = () => {
    setDeviceScanInProgress(true);

    viewModel.scanForDevices().then((ok) => {
      setTimeout(() => {
        setDeviceScanInProgress(false);
      }, 5000);
    });
  };

  const requestConnectDevice = (targetDeviceAddress: string = null) => {
    if (devices.length == 0) {
      return;
    }

    setConnectionInProgress(true);

    // if no target device specified connect to first known device.

    let currentDevice = selectedDevice;
    if (devices.length > 0 && selectedDevice == null) {
      if (targetDeviceAddress != null) {
        currentDevice = devices.find((d) => d.address == targetDeviceAddress);
      }

      if (currentDevice == null) {
        currentDevice = devices[0];
      }

      setSelectedDevice(currentDevice);
    }

    viewModel.connectDevice(currentDevice).then((ok) => {
      setConnected(true);
      setConnectionInProgress(false);

      setTimeout(() => {
        requestCurrentPreset();
      }, 1000);
    });
  };

  const requestCurrentPreset = () => {
    setConnectionInProgress(true);

    viewModel.requestPresetConfig().then((ok) => {
      setConnectionInProgress(false);
      setTimeout(() => {
        console.log(
          "updating preset config in UI " + JSON.stringify(viewModel.preset)
        );

        setCurrentPreset(viewModel.preset);
      }, 500);
    });
  };

  const requestSetChannel = (channelNum: number) => {
    setConnectionInProgress(true);

    viewModel.setChannel(channelNum).then((ok) => {
      setConnectionInProgress(false);
      setSelectedChannel(channelNum);
    });
  };

  const requestSetPreset = () => {

    let preset:Preset = currentPreset;
    preset.sigpath[3].dspId="94MatchDCV2";
    
    setConnectionInProgress(true);

    viewModel.requestPresetChange(preset).then((ok) => {
      setConnectionInProgress(false);
      
    });
  };

  const requestStoreFavourite = ()=>{
    //save current preset
    viewModel.storeFavourite(currentPreset);
  }

  const fxParamChange = (args) => {
    viewModel.requestFxParamChange(args).then(() => {});
  };

  const fxToggle = (args) => {
    viewModel.requestFxToggle(args).then(() => {});
  };

  // configure which state changes should cause component updates
  useEffect(
    () =>
      console.log(
        "re-render because connection changed:",
        connectionInProgress
      ),
    [connectionInProgress, connected, deviceScanInProgress]
  );

  useEffect(() => console.log("re-render because preset changed"), [
    currentPreset,
  ]);

  // perform startup
  useEffect(() => {
    console.log("Startup, connecting..");

    requestScanForDevices();

    setTimeout(() => {
      if (devices.length > 0) {
        requestConnectDevice();
        viewModel.getDeviceName();
      }
      // auto connect
    }, 2000);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <DeviceControls></DeviceControls>
        </Col>
      </Row>
      <Row>
        <Col>
          <MiscControls
            deviceScanInProgress={deviceScanInProgress}
            onScanForDevices={requestScanForDevices}
            connected={connected}
            onConnect={requestConnectDevice}
            connectionInProgress={connectionInProgress}
            requestCurrentPreset={requestCurrentPreset}
            setChannel={requestSetChannel}
            devices={devices}
            selectedChannel={selectedChannel}
            onSetPreset={requestSetPreset}
          ></MiscControls>
        </Col>
      </Row>
      <Row>
        <Col>
          <SignalPathControl
            signalPathState={currentPreset}
            onFxParamChange={fxParamChange}
            onFxToggle={fxToggle}
            selectedChannel={selectedChannel}
            onStoreFavourite={requestStoreFavourite}
          ></SignalPathControl>
        </Col>
      </Row>
      <Row>
        <Col>
          <pre>{JSON.stringify(favourites)}</pre>
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

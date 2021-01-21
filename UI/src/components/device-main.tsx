import * as React from "react";

import * as ReactDOM from "react-dom";

import { BrowserRouter as Router } from "react-router-dom";

import SignalPathControl from "./signal-path";
import DeviceControls from "./device-controls";
import MiscControls from "./misc-controls";

import DeviceViewModel from "../core/deviceViewModel";
import { BluetoothDeviceInfo } from "../spork/src/interfaces/deviceController";

import { useEffect } from "react";
import { Preset } from "../spork/src/interfaces/preset";
import AppViewModel from "../core/appViewModel";

let viewModel: DeviceViewModel = new DeviceViewModel();

const DeviceMainControl = (appViewModel:AppViewModel) => {
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
  const [favourites, setFavourites] = React.useState(viewModel.storedPresets);

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
    let preset: Preset = currentPreset;
    preset.sigpath[3].dspId = "94MatchDCV2";

    setConnectionInProgress(true);

    viewModel.requestPresetChange(preset).then((ok) => {
      setConnectionInProgress(false);
    });
  };

  const requestStoreFavourite = () => {
    //save current preset
    
    appViewModel.storeFavourite(currentPreset);
  };

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

   //viewModel.loadFavourites();

   /* requestScanForDevices();

    setTimeout(() => {
      if (devices.length > 0) {
        requestConnectDevice();
        viewModel.getDeviceName();
      }
      // auto connect
    }, 2000);*/
  }, []);

  return (
    <div className="container m-2">
      <div className="row">
        <div className="col">
          <DeviceControls></DeviceControls>
        </div>
      </div>
      <div className="row">
        <div className="col">
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
        </div>
      </div>
      <div className="row">
        <div className="col">
          <SignalPathControl
            signalPathState={currentPreset}
            onFxParamChange={fxParamChange}
            onFxToggle={fxToggle}
            selectedChannel={selectedChannel}
            onStoreFavourite={requestStoreFavourite}
          ></SignalPathControl>
        </div>
      </div>
      
    </div>
  );
};

export default DeviceMainControl;
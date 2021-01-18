import * as React from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as ReactDOM from "react-dom";

import SignalPathControl from "./signal-path";
import DeviceControls from "./device-controls";
import MiscControls from "./misc-controls";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/styles.css";
import AppViewModel from "../core/appViewModel";
import { useEffect } from "react";

let viewModel: AppViewModel = new AppViewModel();

const App = () => {
  const onViewModelStateChange = () => {
    setCurrentPreset(viewModel.preset);
    setConnected(viewModel.isConnected);
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
  });

  // connection state

  const [connectionInProgress, setConnectionInProgress] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [currentPreset, setCurrentPreset] = React.useState({});

  const scanForDevices = () => {
    setConnectionInProgress(true);

    viewModel.scanForDevices().then((ok) => {
     
      setConnectionInProgress(false);

    });
  };


  const connectDevice = () => {
    setConnectionInProgress(true);

    viewModel.connectDevice().then((ok) => {
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

  const setChannel = (channelNum: number) => {
    setConnectionInProgress(true);

    viewModel.setChannel(channelNum).then((ok) => {
      setConnectionInProgress(false);
    });
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
    [connectionInProgress, connected]
  );

  useEffect(() => console.log("re-render because preset changed"), [
    currentPreset,
  ]);

  useEffect(() => {
    console.log("Startup, connecting..");
   // connectDevice();
  }, []);

  const [presetConfig, setPresetConfig] = React.useState({});

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
            onScanForDevices={scanForDevices}
            connected={connected}
            onConnect={connectDevice}
            connectionInProgress={connectionInProgress}
            requestCurrentPreset={requestCurrentPreset}
            setChannel={setChannel}
          ></MiscControls>
        </Col>
      </Row>
      <Row>
        <Col>
          <SignalPathControl
            signalPathState={currentPreset}
            onFxParamChange={fxParamChange}
            onFxToggle={fxToggle}
          ></SignalPathControl>
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

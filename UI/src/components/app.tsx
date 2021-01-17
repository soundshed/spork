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

const App = () => {
  let viewModel: AppViewModel;

  const onViewModelStateChange = () => {
    setCurrentPreset(viewModel.preset);
    setConnected(viewModel.isConnected);
  };

  useEffect(() => {
    if (!viewModel) {
      viewModel = new AppViewModel(onViewModelStateChange);
      console.log("loaded!");
    }
  });

  // connection state

  const [connectionInProgress, setConnectionInProgress] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [currentPreset, setCurrentPreset] = React.useState({});

  const connectDevice = () => {
    setConnectionInProgress(true);

    viewModel.connectDevice().then((ok) => {
      setConnected(true);
      setConnectionInProgress(false);
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
      }, 1500);
    });
  };

  const setChannel = (channelNum:number) => {
    setConnectionInProgress(true);

    viewModel.setChannel(channelNum).then((ok) => {
      setConnectionInProgress(false);
     
    });
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
          <SignalPathControl
            signalPathState={currentPreset}
          ></SignalPathControl>
        </Col>
      </Row>
      <Row>
        <Col>
          <MiscControls
            connected={connected}
            onConnect={connectDevice}
            connectionInProgress={connectionInProgress}
            requestCurrentPreset={requestCurrentPreset}
            setChannel={setChannel}
          ></MiscControls>
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

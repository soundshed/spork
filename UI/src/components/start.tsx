import * as React from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as ReactDOM from "react-dom";

import SignalPathControl from "./signal-path";
import DeviceControls from "./device-controls";
import MiscControls from "./misc-controls";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/styles.css";
import AppViewModel from "../core/appViewModel";

const App = () => {
  const viewModel: AppViewModel = new AppViewModel();

  // connection state

  const [connectionInProgress, setConnectionInProgress] = React.useState(false);

  const [connected, setConnected] = React.useState(true);
  const connectDevice = () => {
   
    setConnectionInProgress(true);
console.log("::"+connectionInProgress);

    viewModel.connectDevice().then((ok) => {
        console.log("::"+connectionInProgress);
      setConnected(true);
      setConnectionInProgress(false);
    });
  };

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
          <SignalPathControl signalPathState={viewModel.preset}></SignalPathControl>
        </Col>
      </Row>
      <Row>
        <Col>
          <MiscControls
            connected={connected}
            onConnect={connectDevice}
            connectionInProgress={connectionInProgress}
          ></MiscControls>
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

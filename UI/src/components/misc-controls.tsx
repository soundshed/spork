import * as React from "react";
import { Container, Row, Col } from "react-bootstrap";

const MiscControls = ({ connected, onConnect, connectionInProgress }) => {
  return (
    <div className="container m-1">
      {connectionInProgress ? (
        <label>Connecting..</label>
      ) : (
        <label>No connection..</label>
      )}

      <div className="container m-3">
        <button type="button" className="btn btn-secondary" onClick={onConnect}>
          Connect{" "}
          {connectionInProgress ? (
            <span
              id="connect-progress"
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : null}
        </button>
        <button type="button" className="btn btn-secondary" id="getPreset">
          Get Preset
        </button>
        <button type="button" className="btn btn-secondary" id="applyPreset">
          Set Preset
        </button>

        <div className="btn-group" role="group" aria-label="Channel Selection">
          <button type="button" className="btn btn-secondary" id="ch1">
            1
          </button>
          <button type="button" className="btn btn-secondary" id="ch2">
            2
          </button>
          <button type="button" className="btn btn-secondary" id="ch3">
            3
          </button>
          <button type="button" className="btn btn-secondary" id="ch4">
            4
          </button>
        </div>

        <div id="status">{connected}</div>

        <div id="state">---</div>
      </div>
      <div className="m-3">
        <label>
          System: node
          <script>document.write(process.versions.node)</script>, Chrome
          <script>document.write(process.versions.chrome)</script>, and Electron
          <script>document.write(process.versions.electron)</script>.
        </label>
      </div>
    </div>
  );
};

export default MiscControls;

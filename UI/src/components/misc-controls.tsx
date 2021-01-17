import * as React from "react";

const MiscControls = ({
  connected,
  onConnect,
  connectionInProgress,
  requestCurrentPreset,
  setChannel,
}) => {
  return (
    <div className="container m-1">
      {connected ? (
        <label>Connected</label>
      ) : (
        <div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={onConnect}
          >
            Connect
            {connectionInProgress ? (
              <span
                id="connect-progress"
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
          </button>
        </div>
      )}

      <div className="container m-3">
        <div className="row">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={requestCurrentPreset}
            >
              Get Preset
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-secondary"
              id="applyPreset"
            >
              Set Preset
            </button>
          </div>
          <div className="col-md-2">
            <div
              className="btn-group"
              role="group"
              aria-label="Channel Selection"
            >
              <button
                type="button"
                className="btn btn-secondary"
                id="ch1"
                onClick={() => {
                  setChannel(1);
                }}
              >
                1
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                id="ch2"
                onClick={() => {
                  setChannel(2);
                }}
              >
                2
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                id="ch3"
                onClick={() => {
                  setChannel(3);
                }}
              >
                3
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                id="ch4"
                onClick={() => {
                  setChannel(4);
                }}
              >
                4
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiscControls;

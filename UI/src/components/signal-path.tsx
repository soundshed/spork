import * as React from "react";
import FxControl from "./fx-control";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webaudio-knob": any;
      "webaudio-switch": any;
    }
  }
}

const SignalPathControl = ({
  signalPathState,
  onFxParamChange,
  onFxToggle,
  selectedChannel,
  onStoreFavourite
}) => {
  React.useEffect(() => {}, [signalPathState, selectedChannel]);

  if (signalPathState.sigpath == null) signalPathState.sigpath = [];

  const listItems = signalPathState.sigpath.map((fx) => (
    <div key={fx.dspId.toString()} className="col-md-2">
      <FxControl
        fx={fx}
        onFxParamChange={onFxParamChange}
        onFxToggle={onFxToggle}
      ></FxControl>
    </div>
  ));

  return (
    <div>
      {(!signalPathState || signalPathState.sigpath == []) ? (
        <label>Refresh to get current amp settings.</label>
      ) : (
        <div className="container">
          <h6>Signal Chain</h6>

          <h4 className="preset-name">
            [{selectedChannel + 1}] {signalPathState.meta?.name}
          </h4>
          <button className="btn btn-primary" onClick={onStoreFavourite}>⭐ Favourite</button>

          <button className="btn btn-secondary" onClick={onStoreFavourite}>☁ Upload</button>
          <div className="row">{listItems}</div>
        </div>
      )}
    </div>
  );
};

export default SignalPathControl;

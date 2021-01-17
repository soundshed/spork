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

const SignalPathControl = ({ signalPathState }) => {
  if (signalPathState.sigpath == null) signalPathState.sigpath = [];

  const listItems = signalPathState.sigpath.map((fx) => (
    <div key={fx.dspId.toString()} className="col-md-2">
      <FxControl fx={fx}></FxControl>

    
    </div>
  ));

  return (
    <div>
      <h6>Signal Chain</h6>

      <h4 className="preset-name">{signalPathState.meta?.name}</h4>

      <div className="container">
        <div className="row">{listItems}</div>
      </div>
    </div>
  );
};

export default SignalPathControl;

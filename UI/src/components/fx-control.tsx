import * as React from "react";
import FxParam from "./fx-param";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webaudio-knob": any;
      "webaudio-switch": any;
    }
  }
}

const FxControl = ({ fx }) => {
  const paramControls = fx.params.map((p) => (
    <FxParam key={p.index.toString()} p={p} fx={fx}></FxParam>
  ));

  return (
    <div className="fx">
      <label>{fx.type}</label>
      <h4 className="preset-name">{fx.name}</h4>
      <div className="fx-controls">
        {paramControls}

        <webaudio-switch
          src="./lib/webaudio-controls/knobs/switch_toggle.png"
          value={fx.active == true ? "1" : "0"}
          onChange={(e) => console.log(`change, value: ${e.target.value}`)}
          onInput={(e) => console.log(`input, value: ${e.currentTarget.value}`)}
        ></webaudio-switch>

        {fx.active ? <label>On</label> : <label>Off</label>}
      </div>
      {/*<pre>{JSON.stringify(fx)}</pre>*/}
    </div>
  );
};

export default FxControl;

import * as React from "react";

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
    <div key={p.index.toString()}>
      <webaudio-knob
        src="./lib/webaudio-controls/knobs/LittlePhatty.png"
        min="0"
        value={p.value}
        max="1"
      ></webaudio-knob>
      <label>{p.name}</label>
    </div>
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
        ></webaudio-switch>

        {fx.active ? <label>On</label> : <label>Off</label>}

       
      </div>
      
    </div>
  );
};

export default FxControl;

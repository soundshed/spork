import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webaudio-knob": any;
    }
  }
}

const DeviceControls = () => {
  return (
    <div>
      <h6>Device Controls</h6>
      <div>
        <div className="container">
          <div className="row control-strip">
            <div className="col-sm">
              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-bass"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Bass</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-mid"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Mid</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-treble"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Treble</label>
            </div>

            <div className="col-sm">
              <webaudio-knob
                id="knob-master"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Master</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-mod"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Modulation</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-delay"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100" 
              ></webaudio-knob>
              <label>Delay</label>
            </div>
            <div className="col-sm">
              <webaudio-knob
                id="knob-reverb"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Reverb</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceControls;

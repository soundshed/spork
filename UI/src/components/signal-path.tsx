import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webaudio-knob": any;
      "webaudio-switch": any;
    }
  }
}

const SignalPathControl = ({signalPathState}) => {
  return (
    <div>
      <h6>Signal Chain</h6>
      <h4 className="preset-name">Harvester Of Sorrow</h4>
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Noise Gate</h4>

              <webaudio-knob
                id="knob-threshold"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Threshold</label>

              <webaudio-knob
                id="knob-threshold"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Decay</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Comp</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Peak Reduction</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>

          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Drive</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Amp</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Mod</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Delay</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
          <div className="col-md-2">
            <div className="fx">
              <h4 className="preset-name">Reverb</h4>

              <webaudio-knob
                id="knob-gain"
                src="./lib/webaudio-controls/knobs/LittlePhatty.png"
                min="0"
                max="100"
              ></webaudio-knob>
              <label>Gain</label>

              <webaudio-switch
                src="./lib/webaudio-controls/knobs/switch_toggle.png"
                width="32"
                height="32"
              ></webaudio-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalPathControl;

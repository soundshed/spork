import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webaudio-knob": any;
      "webaudio-switch": any;
    }
  }
}

const FxParam = ({ p, fx }) => {
  let customElement;
  const setParamValue = (e) => {
    console.log(`Changed param ${e.target.value} ${JSON.stringify(e.target.tag)} ${fx.name} ${fx.dspId}`);
  };

  React.useEffect(() => {
    customElement?.addEventListener("input", setParamValue);

    return () => {
      customElement?.removeEventListener("input", setParamValue);
    };
  }, [setParamValue]);

  return (
    <div key={p.index.toString()}>
      <webaudio-knob
        ref={(elem) => {
          customElement = elem;
          if (customElement) customElement.tag = p;
        }}
        src="./lib/webaudio-controls/knobs/LittlePhatty.png"
        min="0"
        value={p.value}
        max="1"
        step="0.01"
      ></webaudio-knob>
      <label>{p.name}</label>
    </div>
  );
};

export default FxParam;

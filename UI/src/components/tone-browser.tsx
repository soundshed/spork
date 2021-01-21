import * as React from "react";
import { useEffect } from "react";
import { Tone } from "../core/soundshedApi";
import { Preset } from "../spork/src/interfaces/preset";

const ToneBrowserControl = (presets) => {
  useEffect(() => {}, [presets]);

  const listItems = presets.presets.map((fx: Tone) => (
    <div key={fx.preset.meta.id} className="tone">
      <label>{fx.preset.meta.description}</label>
      <p>{fx.preset.meta.description}</p>
    </div>
  ));

  return (
    <div className="container m-2">
      <h1>Tones</h1>

      <p>Browse and manage favourite tones.</p>

      {!presets || presets == [] ? (
        <label>No favourite tones saved.</label>
      ) : (
        <div>{listItems}</div>
      )}
    </div>
  );
};

export default ToneBrowserControl;

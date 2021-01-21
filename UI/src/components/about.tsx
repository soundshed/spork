import * as React from "react";
import { useEffect } from "react";

import { shell } from "electron";

const AboutControl = () => {
  const openLink = (e, linkUrl) => {
    e.preventDefault();
    shell.openExternal(linkUrl, {});
  };

  return (
    <div className="container m-2">
      <h1>About</h1>

      <p>
        <a
          href="#"
          onClick={(e) => {
            openLink(e, "https://soundshed.com");
          }}
        >
          soundshed.com
        </a>
      </p>
      <p>Browse and manage favourite tones, preview or store on your amp.</p>

      <h3>Credits</h3>
      <p>
        Spark communications code based on
        https://github.com/paulhamsh/Spark-Parser
      </p>
      <p>Burning Guitar Photo by Dark Rider on Unsplash</p>
    </div>
  );
};

export default AboutControl;

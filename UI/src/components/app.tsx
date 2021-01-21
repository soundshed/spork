import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect } from "react";
import { HashRouter as Router, Route, NavLink, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/styles.css";

import DeviceMainControl from "./device-main";
import ToneBrowserControl from "./tone-browser";
import AppViewModel from "../core/appViewModel";
import HomeControl from "./home";
import AboutControl from "./about";

let viewModel: AppViewModel = new AppViewModel();

const App = () => {
  const [favourites, setFavourites] = React.useState(viewModel.storedPresets);

  // perform startup
  useEffect(() => {
    console.log("Startup, connecting..");

    let f = viewModel.loadFavourites();

    setFavourites(f);
  }, []);

  return (
    <Router>
      <main>
     
        <ul className="nav nav-tabs">
          <li className="nav-item">
           
              <NavLink to="/" exact className="nav-link" activeClassName="nav-link active">
                Home
              </NavLink>
           
          </li>
          <li className="nav-item">
       
              <NavLink to="/tones" className="nav-link" activeClassName="nav-link active">
                Tones
              </NavLink>
         
          </li>
          <li className="nav-item">
            
              <NavLink to="/device" className="nav-link" activeClassName="nav-link active">
                Amp
              </NavLink>
          
          </li>
          <li className="nav-item">
            
              <NavLink to="/about" className="nav-link" activeClassName="nav-link active">
                About
              </NavLink>
          
          </li>
        </ul>

        <Switch>
          <Route path="/" exact component={HomeControl}  />
          <Route path="/device" component={DeviceMainControl} />
          <Route path="/tones" render={() => <ToneBrowserControl presets={favourites}></ToneBrowserControl>} />
          <Route path="/about" exact component={AboutControl}  />
        </Switch>
      </main>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

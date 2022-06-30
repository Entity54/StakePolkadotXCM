import React, { useContext } from "react";

/// React router dom
import {  Switch, Route } from "react-router-dom";
   
/// Css 
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Header from "./layouts/nav/Header";
import NAV_NavHade from "./layouts/nav/NavHader";
import NAV_SideBar from "./layouts/nav/SideBar";

import Footer from "./layouts/Footer";

/// Dashboard
import DEX from "./components/Dashboard/DEX";


import { ThemeContext } from "../context/ThemeContext"; 


const Markup = ( { setupSpecs, polakdotSignerfunction, polkadtoAccountList, relaySpecs, karuraAlphaSpecs, blockHeader, evm_api_state, accountList, polakdotAccountSigner }) => {

  const { menuToggle } = useContext(ThemeContext);

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div id={`${!pagePath ? "main-wrapper" : ""}`} className={`${!pagePath ? "show" : "mh100vh"}  ${menuToggle ? "menu-toggle" : ""}`}>

        {!pagePath && <Header setupSpecs={setupSpecs} polakdotSignerfunction={polakdotSignerfunction} polkadtoAccountList={polkadtoAccountList} evm_api_state={evm_api_state} blockHeader={blockHeader} accountList={accountList}/>}
        {!pagePath && <NAV_NavHade blockHeader={blockHeader} />}
        {!pagePath && <NAV_SideBar />}

        <div className={`${!pagePath ? "content-body" : ""}`} style={{marginBottom:"-450px"}}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              <Route exact path='/'> 
                   <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} blockHeader={blockHeader}  accountList={accountList}  polakdotAccountSigner={polakdotAccountSigner} /> 
              </Route>
              <Route exact path='/xcm'> 
                     <DEX  setupSpecs={setupSpecs} relaySpecs={relaySpecs} karuraAlphaSpecs={karuraAlphaSpecs} blockHeader={blockHeader}  accountList={accountList}  polakdotAccountSigner={polakdotAccountSigner} /> 
              </Route>

            </Switch> 
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </>
  );
};

export default Markup;

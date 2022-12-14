import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./index.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { BrowserRouter as Router } from "react-router-dom";
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);


root.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount
      // appId={"JVmVRhHRQpENMcVquiNmzqUg2rRNylXJWlaFl5MX"} //Moralis appID leider wird der bald ablaufen 30.11.2022
      appId={""} 
      // serverUrl={"https://btn15x3goukm.usemoralis.com:2053/server"} //Moralis Server URL leider wird der bald ablaufen 30.11.2022
      serverUrl={"http://localhost:1337/server"} //mein Server
    >
      <NotificationProvider> 
        <Router>
          <App />
        </Router>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
);



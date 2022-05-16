import "./src/css/index.css"
import "./src/css/tailwind-mods.css"
import React from "react"
import { withStore } from "./src/components/WebSocketStore/WebSocketStore.js";

// Import font awesome icons. Must install package first (npm i @fortawesome/fontawesome-free)
import "@fortawesome/fontawesome-free/css/all.min.css";

import Layout from "./src/layouts/layout1.js";

export const onRouteUpdate = ({ location, prevLocation }) => {
  console.log("new pathname", location.pathname)
  console.log("old pathname", prevLocation ? prevLocation.pathname : null)
}

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}

export const wrapRootElement = withStore;
  
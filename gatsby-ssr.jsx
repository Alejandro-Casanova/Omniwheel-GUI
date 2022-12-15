import "./src/css/index.css"
import "./src/css/tailwind-mods.css"
import React from "react"
import { withStore } from "./src/components/Store/Store.jsx";

// Import font awesome icons. Must install package first (npm i @fortawesome/fontawesome-free)
import "@fortawesome/fontawesome-free/css/all.min.css";

import Layout from "./src/layouts/layout.js";

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}

export const wrapRootElement = withStore;
  
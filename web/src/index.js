import ReactDOM from "react-dom";
import React from "react";

import Viewport from "containers/Viewport";

import "static/dripicons.css"

import { rxConnect } from "rx-connect";
import rx5Adapter from "rx-connect/lib/rx5Adapter";
rxConnect.adapter = rx5Adapter;

ReactDOM.render(
    <Viewport/>,
    document.getElementById('root')
);

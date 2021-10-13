import React from "react";
import ReactDOM from "react-dom";
import "./style/style.scss";
import App from "./ts/App";
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

import {createRoot} from "react-dom/client";
import {AdaptivityProvider, ConfigProvider} from "@vkontakte/vkui";
import * as React from "react";
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <ConfigProvider appearance={"light"}>
        <AdaptivityProvider>
            <App />
        </AdaptivityProvider>
    </ConfigProvider>,
);


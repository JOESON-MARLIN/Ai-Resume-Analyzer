import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CareerProvider } from "./CareerContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <CareerProvider>
                <App />
            </CareerProvider>
        </BrowserRouter>
    </StrictMode>
);
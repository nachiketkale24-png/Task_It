import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Apply saved theme before first render to avoid flash
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

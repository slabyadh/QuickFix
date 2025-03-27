import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import App from "./App";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  console.error("Élément #root introuvable dans le DOM.");
}

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { LoaderProvider } from "./context/LoaderContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoaderProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoaderProvider>
  </BrowserRouter>
);

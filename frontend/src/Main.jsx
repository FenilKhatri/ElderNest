import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { LoaderProvider } from "./context/LoaderContext.jsx";

createRoot(document.getElementById("root")).render(
  <LoaderProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LoaderProvider>,
);

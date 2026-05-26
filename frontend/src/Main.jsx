import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { LoaderProvider } from "./context/LoaderContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ServiceProvider } from './context/ServiceContext.jsx';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoaderProvider>
      <AuthProvider>
        <ServiceProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ServiceProvider>
      </AuthProvider>
    </LoaderProvider>
  </BrowserRouter>
);

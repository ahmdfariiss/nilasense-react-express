import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";

import { AuthProvider } from "./contexts/AuthContext.jsx";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

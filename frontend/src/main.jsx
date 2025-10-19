import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";

// Import AuthProvider dari context
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { router } from "./router/index.jsx";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

// This file is now replaced by React Router
// All routing logic has been moved to src/router/index.jsx
// Main entry point is now in src/main.jsx

export default function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          App.jsx is deprecated
        </h1>
        <p className="text-muted-foreground">
          This application now uses React Router for navigation.
          <br />
          Please check src/router/index.jsx for routing configuration.
        </p>
      </div>
    </div>
  );
}
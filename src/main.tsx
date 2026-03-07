import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure there is a <div id='root'> in index.html."
  );
}

const ErrorFallback = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => (
  <div className="flex min-h-screen items-center justify-center p-4">
    <div className="text-center">
      <h1 className="mb-2 font-bold text-2xl text-slate-800">
        Something went wrong
      </h1>
      <p className="mb-4 text-slate-600">
        Please refresh the page to try again.
      </p>
      <button
        className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-900"
        onClick={resetErrorBoundary}
        type="button"
      >
        Try again
      </button>
    </div>
  </div>
);

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

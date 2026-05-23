import React from "react";
import ReactDOM from "react-dom/client";
import HealthAIApp from "./HealthAIApp.jsx";

console.log("main.jsx: Starting React initialization");

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  console.log("main.jsx: React root created");

  root.render(
    <React.StrictMode>
      <HealthAIApp />
    </React.StrictMode>,
  );
  console.log("main.jsx: HealthAIApp rendered");
} catch (error) {
  console.error("main.jsx: Error during render", error);
  document.getElementById("root").innerHTML =
    `<div style="padding: 20px; color: red;"><h1>Error: ${error.message}</h1><pre>${error.stack}</pre></div>`;
}

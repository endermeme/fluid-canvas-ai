
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wrap in function to avoid unnecessary re-renders
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  // Use safer way to check rendering
  try {
    const root = createRoot(rootElement);
    root.render(
      <App />
    );
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};

renderApp();

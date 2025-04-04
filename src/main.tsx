
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Bọc trong hàm để tránh re-render không cần thiết
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  // Kiểm tra nếu đã có phiên bản trước đó
  if (rootElement._reactRootContainer) {
    console.log("Ứng dụng đã được khởi tạo, bỏ qua việc render lại");
    return;
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
};

renderApp();

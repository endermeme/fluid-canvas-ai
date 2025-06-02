
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ToastProvider } from './hooks/use-toast'

// Bọc trong hàm để tránh re-render không cần thiết
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  // Sử dụng cách an toàn hơn để kiểm tra việc render
  try {
    const root = createRoot(rootElement);
    root.render(
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    );
    console.log("Ứng dụng đã được khởi tạo thành công");
  } catch (error) {
    console.error("Lỗi khi khởi tạo ứng dụng:", error);
  }
};

renderApp();

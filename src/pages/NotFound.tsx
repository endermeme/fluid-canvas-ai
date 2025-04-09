
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Trang không tồn tại</p>
        <p className="mb-8 text-muted-foreground">Đường dẫn "{location.pathname}" không được tìm thấy trong ứng dụng.</p>
        <Link to="/" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

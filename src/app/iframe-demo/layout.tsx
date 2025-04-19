import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canvas Demo Preview',
  description: 'Xem trước demo tương tác với Canvas HTML5',
};

export default function IframeDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-indigo-50 to-white">
      {children}
      
      <footer className="max-w-5xl mx-auto mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
        <p>Demo iframe preview tool © {new Date().getFullYear()}</p>
        <p className="mt-1">Sử dụng iframe để hiển thị và preview các demo HTML</p>
      </footer>
    </div>
  );
}
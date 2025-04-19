import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Lấy file name từ query params nếu có 
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file') || 'wheel-demo';
    
    // Đường dẫn đến file HTML demo
    const filePath = path.join(process.cwd(), `src/components/quiz/demo/${fileName}.html`);
    
    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return new NextResponse(`File demo "${fileName}.html" không tồn tại`, { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    // Đọc nội dung file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Trả về nội dung dưới dạng text
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error reading demo file:', error);
    return new NextResponse('Không thể đọc file demo', { status: 500 });
  }
} 
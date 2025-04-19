import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Đường dẫn đến file HTML demo
    const filePath = path.join(process.cwd(), 'src/components/quiz/demo/iframe-test.html');
    
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
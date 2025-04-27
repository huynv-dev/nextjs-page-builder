import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Lấy slug từ query params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Đường dẫn tới thư mục chứa layouts
    const layoutsDir = path.join(process.cwd(), 'public', 'pages');
    
    // Kiểm tra xem thư mục có tồn tại không
    if (!fs.existsSync(layoutsDir)) {
      // Tạo thư mục nếu chưa tồn tại
      fs.mkdirSync(layoutsDir, { recursive: true });
      return NextResponse.json([], { status: 200 });
    }

    // Nếu có slug cụ thể và file tồn tại, chỉ trả về layout đó
    if (slug) {
      const filePath = path.join(layoutsDir, `${slug}.json`);
      
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const layout = {
          slug,
          content,
          createdAt: fs.statSync(filePath).birthtime,
          updatedAt: fs.statSync(filePath).mtime
        };
        
        return NextResponse.json([layout], { status: 200 });
      }
      
      // Nếu không tìm thấy file với slug yêu cầu, thử tìm home
      if (slug !== 'home') {
        const homeFilePath = path.join(layoutsDir, 'home.json');
        
        if (fs.existsSync(homeFilePath)) {
          const content = JSON.parse(fs.readFileSync(homeFilePath, 'utf8'));
          const layout = {
            slug: 'home',
            content,
            createdAt: fs.statSync(homeFilePath).birthtime,
            updatedAt: fs.statSync(homeFilePath).mtime
          };
          
          return NextResponse.json([layout], { status: 200 });
        }
      }
      
      // Không tìm thấy layout
      return NextResponse.json([], { status: 200 });
    }
    
    // Lấy tất cả layouts nếu không có slug
    const files = fs.readdirSync(layoutsDir);
    const layouts = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(layoutsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileSlug = file.replace('.json', '');
        
        return {
          slug: fileSlug,
          content,
          createdAt: fs.statSync(filePath).birthtime,
          updatedAt: fs.statSync(filePath).mtime
        };
      });
    
    return NextResponse.json(layouts, { status: 200 });
  } catch (error) {
    console.error('Error fetching layouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch layouts' },
      { status: 500 }
    );
  }
} 
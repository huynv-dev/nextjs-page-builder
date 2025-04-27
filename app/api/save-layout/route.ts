import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Giá trị mặc định cho slug là 'home' nếu không có trong request
    let { slug = 'home', nodeTree, html } = await request.json();
    
    if (!slug) {
      slug = 'home';
    }
    
    // Đảm bảo thư mục tồn tại
    const pagesDir = path.join(process.cwd(), 'public', 'pages');
    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }
    
    // Lưu file JSON (nodeTree)
    const jsonPath = path.join(pagesDir, `${slug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(nodeTree, null, 2));
    
    // Lưu file HTML
    const htmlPath = path.join(pagesDir, `${slug}.html`);
    fs.writeFileSync(htmlPath, html);
    
    return NextResponse.json(
      { success: true, message: `Layout "${slug}" saved successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving layout:', error);
    return NextResponse.json(
      { error: 'Failed to save layout' },
      { status: 500 }
    );
  }
}

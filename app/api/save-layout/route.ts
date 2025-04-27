import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { slug, nodeTree, html } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
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
      { success: true, message: 'Layout saved successfully' },
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

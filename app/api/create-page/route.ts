import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { title, slug, nodeTree, html } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    // Chuẩn hóa slug
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Đảm bảo thư mục tồn tại
    const pagesDir = path.join(process.cwd(), 'public', 'pages');
    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }
    
    // Tạo metadata cho trang
    const metadata = {
      title: title || sanitizedSlug,
      slug: sanitizedSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Lưu file metadata
    const metadataPath = path.join(pagesDir, `${sanitizedSlug}.meta.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Lưu file JSON (nodeTree)
    const jsonPath = path.join(pagesDir, `${sanitizedSlug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(nodeTree, null, 2));
    
    // Lưu file HTML
    const htmlPath = path.join(pagesDir, `${sanitizedSlug}.html`);
    fs.writeFileSync(htmlPath, html);
    
    return NextResponse.json(
      { 
        success: true, 
        message: `Page "${title || sanitizedSlug}" created successfully`,
        page: metadata
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
} 
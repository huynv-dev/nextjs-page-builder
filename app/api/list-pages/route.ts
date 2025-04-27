import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface PageMetadata {
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    const pagesDir = path.join(process.cwd(), "public", "pages");

    if (!fs.existsSync(pagesDir)) {
      return NextResponse.json({ pages: [] });
    }

    const files = fs.readdirSync(pagesDir);

    // Lọc ra các file .html để lấy slug
    const pageFiles = files
      .filter(file => file.endsWith(".html"))
      .map(file => file.replace(".html", ""));

    // Tạo danh sách trang với thông tin metadata
    const pages: PageMetadata[] = pageFiles.map(slug => {
      const metadataPath = path.join(pagesDir, `${slug}.meta.json`);
      
      // Kiểm tra xem file metadata có tồn tại không
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          return JSON.parse(metadataContent) as PageMetadata;
        } catch (error) {
          console.error(`Error reading metadata for ${slug}:`, error);
        }
      }
      
      // Nếu không có metadata, tạo metadata mặc định
      return {
        title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error listing pages:", error);
    return NextResponse.json({ pages: [] });
  }
}

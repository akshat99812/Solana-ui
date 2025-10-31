import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('file');

  if (!filePath) {
    return new NextResponse('File path is required', { status: 400 });
  }

  try {
    const projectRoot = process.cwd();
    const absolutePath = path.join(projectRoot, filePath);

    // Security check: Ensure the path is within the project
    if (!absolutePath.startsWith(projectRoot)) {
      return new NextResponse('Invalid file path', { status: 400 });
    }

    const content = await fs.readFile(absolutePath, 'utf-8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (_error) {
    return new NextResponse('File not found', { status: 404 });
  }
}

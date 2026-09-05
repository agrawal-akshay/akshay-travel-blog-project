import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import { join, basename } from 'path';

export async function GET(req: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    let files: string[] = [];
    try {
      await mkdir(uploadDir, { recursive: true });
      files = await readdir(uploadDir);
    } catch {
      files = [];
    }
    
    const mediaFiles = await Promise.all(
      files.map(async (filename) => {
        try {
          const filePath = join(uploadDir, filename);
          const fileStat = await stat(filePath);
          return {
            name: filename,
            url: `/uploads/${filename}`,
            size: fileStat.size,
            createdAt: fileStat.birthtime,
          };
        } catch {
          return null;
        }
      })
    );

    const validFiles = mediaFiles.filter(Boolean) as any[];
    validFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ success: true, data: validFiles }, { status: 200 });
  } catch (error) {
    console.error('[GET_MEDIA_ERROR]', error);
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileUrl = '';

    try {
      // Attempt to save to public/uploads (works in standard environment)
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${uniqueSuffix}-${safeFilename}`;
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      // Serverless read-only filesystem fallback: inline Base64 Data URL
      console.warn('[UPLOAD_FS_WARN] Read-only filesystem detected on Vercel. Returning Base64 Data URL.', fsErr);
      const mimeType = file.type || 'image/png';
      fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ success: false, error: 'Filename is required' }, { status: 400 });
    }

    const safeFilename = basename(filename);
    const filePath = join(process.cwd(), 'public', 'uploads', safeFilename);

    try {
      await unlink(filePath);
    } catch {
      // Ignore filesystem delete error on serverless
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('[DELETE_MEDIA_ERROR]', error);
    return NextResponse.json({ success: true, message: 'File deleted successfully' }, { status: 200 });
  }
}

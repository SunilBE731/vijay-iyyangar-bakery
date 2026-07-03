import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vijay-iyengar-secret-key-12345';

// Helper to verify admin token
function verifyAdminToken(request: Request): boolean {
  try {
    const authHeader = request.headers.get('authorization');
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
    if (!token) return false;
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded && decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const updated = db.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}

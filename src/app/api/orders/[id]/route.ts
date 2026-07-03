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

// GET /api/orders/[id] - Allows public tracking
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order details' }, { status: 500 });
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
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
    const { orderStatus, paymentStatus } = body;

    let updated = null;

    if (orderStatus) {
      updated = db.updateOrderStatus(id, orderStatus);
    }
    if (paymentStatus) {
      updated = db.updateOrderPaymentStatus(id, paymentStatus);
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}

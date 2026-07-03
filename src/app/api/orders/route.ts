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

// GET all orders (Admin only)
export async function GET(request: Request) {
  try {
    if (!verifyAdminToken(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orders = db.getOrders();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, phone, whatsapp, items, totalAmount, paymentMethod,
      isCustomCake, cakeFlavor, weight, theme, occasion, deliveryDate,
      deliveryTime, deliveryAddress, referenceImage, instructions
    } = body;

    // Validate base fields
    if (!customerName || !phone || !whatsapp) {
      return NextResponse.json({ success: false, message: 'Customer details are required' }, { status: 400 });
    }

    if (!isCustomCake && (!items || items.length === 0)) {
      return NextResponse.json({ success: false, message: 'No items in the order' }, { status: 400 });
    }

    const newOrder = db.createOrder({
      customerName,
      phone,
      whatsapp,
      items: items || [],
      totalAmount: Number(totalAmount),
      paymentMethod,
      isCustomCake: !!isCustomCake,
      cakeFlavor,
      weight: weight ? Number(weight) : undefined,
      theme,
      occasion,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
      referenceImage,
      instructions
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to place order' }, { status: 500 });
  }
}

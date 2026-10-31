import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID missing" }, { status: 400 });
    }

    const db = (await clientPromise).db('primeZoneDB');
    const ordersCollection = db.collection('ordersCollection');

    const result = await ordersCollection.aggregate([
      { $match: { userId: String(userId) } },
      { $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: { $sum: { $cond: [{ $eq: [{ $toLower: { $ifNull: ["$status", ""] } }, "pending"] }, 1, 0] } },
          receivedOrders: { $sum: { $cond: [{ $in: [{ $toLower: { $ifNull: ["$status", ""] } }, ["received", "delivered"]] }, 1, 0] } },
          totalSpent: { $sum: { $convert: { input: "$totalPrice", to: "double", onError: 0, onNull: 0 } } }
        }
      },
      { $project: {
          _id: 0, totalOrders: 1, pendingOrders: 1, receivedOrders: 1,
          notReceivedOrders: { $subtract: [{ $subtract: ["$totalOrders", "$pendingOrders"] }, "$receivedOrders"] },
          totalSpent: 1
        }
      }
    ]).toArray();

    const stats = result[0] || { totalOrders: 0, pendingOrders: 0, receivedOrders: 0, notReceivedOrders: 0, totalSpent: 0 };
    return NextResponse.json({ success: true, stats });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
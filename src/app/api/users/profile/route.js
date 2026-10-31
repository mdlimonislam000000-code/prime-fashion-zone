import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userId, name, phone, city, address, image } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required!" }, { status: 400 });
    }

    const db = (await clientPromise).db('primeZoneDB');
    const usersCollection = db.collection('user'); // আপনার কালেকশন নাম 'user'

    // আইডি স্ট্রিং হোক বা ObjectId, উভয়ভাবেই কুয়েরি করার জন্য সঠিক ফরম্যাট তৈরি
    let queryId;
    try {
      queryId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    } catch (e) {
      queryId = userId;
    }

    const updateDoc = {
      $set: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(city !== undefined && { city }),
        ...(address !== undefined && { address }),
        ...(image !== undefined && { image }),
        updatedAt: new Date()
      }
    };

    const result = await usersCollection.updateOne(
      { _id: queryId },
      updateDoc
    );

    // যদি ObjectId দিয়ে ম্যাচ না করে, তবে স্ট্রিং আইডি দিয়ে ট্রাই করবে
    if (result.matchedCount === 0) {
      await usersCollection.updateOne(
        { _id: String(userId) },
        updateDoc
      );
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}
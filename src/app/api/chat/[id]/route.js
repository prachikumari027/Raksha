import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/models/chatModel";

// GET /api/chat/:id → Fetch chat by ID
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const chat = await Chat.findById(id).populate("senderId receiverId bookingId");
    if (!chat) return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
  }
}

// POST /api/chat/:id → Add a new message
export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const { text } = await req.json();

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      {
        $push: { messages: { text, timestamp: new Date() } },
      },
      { new: true }
    );

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
  }
}

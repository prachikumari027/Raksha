import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorBooking", required: true },

  messages: [
    {
      text: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
  ],  
});

chatSchema.index({ senderId: 1, receiverId: 1, bookingId: 1 });
const chatModel = mongoose.models.Chats || mongoose.model("Chats", chatSchema);

export default chatModel;

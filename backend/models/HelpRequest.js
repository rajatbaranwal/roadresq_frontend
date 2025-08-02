import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicleType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ Add this
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'resolved'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
export default mongoose.model('HelpRequest', helpRequestSchema);

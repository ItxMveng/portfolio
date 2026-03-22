import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Domain || mongoose.model('Domain', DomainSchema);

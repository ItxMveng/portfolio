import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  photoUrl: String,
  cvUrl: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
  },
  metrics: [{
    label: String,
    value: String,
  }],
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

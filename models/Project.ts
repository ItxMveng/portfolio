import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: String,
  imageUrl: String,
  technologies: [String],
  domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  demoUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

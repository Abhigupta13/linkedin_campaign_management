import mongoose, { Schema, Document } from 'mongoose';

export interface ILinkedInProfile extends Document {
  fullName: string;
  headline?: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  about?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkedInProfileSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    headline: {
      type: String,
      trim: true
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    profileUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    about: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ILinkedInProfile>('LinkedInProfile', LinkedInProfileSchema);
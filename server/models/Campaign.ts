import mongoose, { Schema, Document } from 'mongoose';

export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    status: { 
      type: String, 
      enum: Object.values(CampaignStatus),
      default: CampaignStatus.ACTIVE 
    },
    leads: { 
      type: [String],
      default: [] 
    },
    accountIDs: { 
      type: [String],
      default: [] 
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
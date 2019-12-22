import { Schema, model, Types, Document } from 'mongoose';

export interface IRequest extends Document {
    concept: string;
    description: string;
    amount: number;
    status: string;
    checked: boolean;
    user: string;
    checkups: [string];
    pendingAmount: number;
}

const requestSchema = new Schema({
    concept: String,
    description: String,
    amount: Number,
    status: { type: String, default: 'Pendiente' },
    checked: Boolean,
    user: { type: Types.ObjectId, ref: 'User' },
    checkups: [{ type: Types.ObjectId, ref: 'Checkup' }],
    pendingAmount: { type: Number, default: 0 }
},{
    timestamps: true
});

export default model<IRequest>('Request', requestSchema);
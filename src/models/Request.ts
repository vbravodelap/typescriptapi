import { Schema, model, Types, Document } from 'mongoose';

export interface IRequest extends Document {
    concept: string;
    description: string;
    amount: number;
    status: string;
    checked: boolean;
    user: string;
}

const requestSchema = new Schema({
    concept: String,
    description: String,
    amount: Number,
    status: { type: String, default: 'Pendiente' },
    checked: Boolean,
    user: { type: Types.ObjectId, ref: 'User' },
},{
    timestamps: true
});

export default model<IRequest>('Request', requestSchema);
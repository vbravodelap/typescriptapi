import { Schema, model, Types, Document } from 'mongoose';

export interface ICheckup extends Document {
    concept: string;
    amount: string;
    request: string;
    user: string;
}

const checkupSchema = new Schema({
    concept: String,
    amount: Number,
    request: {
        type: Types.ObjectId,
        ref: 'Request'
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

export default model<ICheckup>('Checkup', checkupSchema);

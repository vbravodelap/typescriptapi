import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    nickname: string;
    entryDate: string;
    region: string;
    state: string;
    branch: string;
    vacations: number;
    department: string;
    accountant: string;
    coordinator: string;
    role: string;
    checked: number;
    requested: number;
    email: string;
    password: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
    },
    entryDate: {
        type: Date
    },
    region: String,
    state: String,
    branch: String,
    vacations: Number,
    department: String,
    accountant: {
        type: Types.ObjectId,
        ref: 'User'
    },
    coordinator: {
        type: Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: String,
        required: true,
        default: 'USER'
    },
    requested: Number,
    checked: Number,
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', userSchema);

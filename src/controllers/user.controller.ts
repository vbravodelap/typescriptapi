import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export const store = async (req: Request, res: Response) => {
    const user: IUser = new User({
        name: req.body.name,
        nickname: req.body.nickname,
        region: req.body.region,
        state: req.body.state,
        branch: req.body.branch,
        vacations: req.body.vacations,
        department: req.body.department,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        accountant: req.body.accountant,
        coordinator: req.body.coordinator
    });

    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();
    const token: string = jwt.sign({_id: savedUser._id}, process.env.TOKENSECRET || 'randomSecret');
    
    res.header('auth-token', token).json(savedUser);
};

export const signin = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(400).json('Email or password is wrong');
    }

    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if(!correctPassword){
        return res.status(400).json('Incorrect password');
    }

    const token: string = jwt.sign({ _id: user._id }, process.env.TOKENSECRET || 'randomSecret', {
        expiresIn: 60 * 60 * 60
    });

    res.header('auth-token', token).json(user);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, { password: 0 });
    if(!user) return res.status(404).json('No user found')
    
    res.json(user);
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await User.find().populate(['accountant', 'coordinator']).exec();
    if(!users) return res.status(404).json('Users not found');

    res.json(users);
}

export const getUser = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId).populate(['accountant', 'coordinator']).exec();
    if(!user) return res.status(404).json('User not found');

    res.json(user);
}
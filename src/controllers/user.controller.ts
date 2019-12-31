import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import userCreateMail from "../mails/userCreateMail";
import { validationResult } from "express-validator";

const SECRET_KEY = process.env.TOKENSECRET || "randomSecret";

export const store = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors);
  }

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
    requested: 0,
    checked: 0
  });

  User.findOne({ email: user.email }, (error, userEmail) => {
    if (error) {
        res.json('Error, user not found');
    }

    if(!userEmail) {
        User.findOne( { nickname: user.nickname }, async (error, userNickname) => {
            if(error){
                res.json('Error trying to search a user');
            }

            if(!userNickname) {
                user.password = await user.encryptPassword(user.password);
                const savedUser = await user.save();
                if (savedUser) {
                    await userCreateMail(savedUser.email, savedUser.name);
                }
        
                const token: string = jwt.sign({ _id: savedUser._id }, SECRET_KEY);
        
                res.header("auth-token", token).json(savedUser);
            }

            if(userNickname){
                res.json('Error, user with this nickname exist in the database');
            }
        });
    }

    if (userEmail) {
       res.json("User exist in the database");
    }
  });
};

export const signin = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json("Email or password is wrong");
  }

  const correctPassword: boolean = await user.validatePassword(
    req.body.password
  );
  if (!correctPassword) {
    return res.status(400).json("Incorrect password");
  }

  const token: string = jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: 60 * 60 * 60
  });

  res.header("auth-token", token).json({ user, token });
};

export const profile = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId, { password: 0 });
  if (!user) return res.status(404).json("No user found");

  res.json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
    .populate(["accountant", "coordinator"])
    .exec();
  if (!users) return res.status(404).json("Users not found");

  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId)
    .populate(["accountant", "coordinator"])
    .exec();
  if (!user) return res.status(404).json("User not found");

  res.json(user);
};

export const whoiam = async (req: Request, res: Response) => {
  const user = await User.findById(req.headers.authorization);
  if (!user) {
    return res.status(404).json("User not found");
  }

  res.json(user);
};

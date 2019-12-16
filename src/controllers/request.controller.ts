import { Request, Response } from 'express';
import docRequest, { IRequest } from '../models/Request';

export const store = async (req: Request, res: Response) => {
    const request: IRequest = new docRequest({
        concept: req.body.concept,
        description: req.body.description,
        amount: req.body.amount,
        checked: false,
        user: req.userId
    })

    const savedRequest = await request.save();

    if(!savedRequest) return res.status(400).json('Request create error');

    res.json(savedRequest);
}

export const getRequests = async (req: Request, res: Response) => {
    const requests = await docRequest.find().populate('user').exec();
    if(!requests) return res.status(404).json('Request not found');

    res.json(requests);
}
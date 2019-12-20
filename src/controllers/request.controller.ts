import { Request, Response } from "express";
import docRequest, { IRequest } from "../models/Request";
import {
  updateUserRequested,
  requestIsDelete
} from "../helpers/request.helpers";

export const store = async (req: Request, res: Response) => {
  const request: IRequest = new docRequest({
    concept: req.body.concept,
    description: req.body.description,
    amount: req.body.amount,
    checked: false,
    user: req.userId
  });

  let amount: number = parseFloat(req.body.amount);
  updateUserRequested(req.userId, amount);

  const savedRequest = await request.save();

  if (!savedRequest) return res.status(400).json("Request create error");

  res.json(savedRequest);
};

export const getRequest = async (req: Request, res: Response) => {
  const request = await docRequest
    .findById(req.params.requestId)
    .populate(["user", "checkups"])
    .exec();
  if (!request) return res.status(404).json("Request not found");

  res.json(request);
};

export const getRequests = async (req: Request, res: Response) => {
  const requests = await docRequest
    .find()
    .populate(["user", "checkups"])
    .exec();
  if (!requests) return res.status(404).json("Request not found");

  res.json(requests);
};

export const destroy = async (req: Request, res: Response) => {
  const deletedRequest = await docRequest.findByIdAndRemove(
    req.params.requestId
  );

  if (!deletedRequest) return res.status(400).json("Request not deleted");

  if (deletedRequest) {
    const amount: number = deletedRequest.amount;
    requestIsDelete(req.userId, amount);
    res.json(deletedRequest);
  }
};

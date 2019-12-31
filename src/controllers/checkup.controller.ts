import { Request, Response } from "express";
import Checkup, { ICheckup } from "../models/Checkup";
import { checkupIsCreate, checkupIsDelete } from "../helpers/checkup.helpers";

export const store = async (req: Request, res: Response) => {
  const checkup: ICheckup = new Checkup({
    concept: req.body.concept,
    amount: req.body.amount,
    request: req.params.requestId,
    user: req.userId
  });

  const savedCheckup = await checkup.save();

  const amount: number = parseFloat(req.body.amount);
  const checkupId: string = savedCheckup._id;

  checkupIsCreate(req.userId, amount, req.params.requestId, checkupId);

  if (!savedCheckup) return res.status(400).json("Error saving checkup");

  return res.json(savedCheckup);
};

export const getCheckups = async (req: Request, res: Response) => {
  const checkups = await Checkup.find()
    .populate(["request", "user"])
    .exec();
  if (!checkups) return res.status(404).json("Checkup not found");

  res.json(checkups);
};

export const destroy = async (req: Request, res: Response) => {
  const deletedCheckup = await Checkup.findByIdAndRemove(req.params.checkupId);
  if (!deletedCheckup) return res.status(400).json("Checkup not deleted");

  // Pending edit
  if (deletedCheckup) {
    const amount: number = parseFloat(deletedCheckup.amount);
    checkupIsDelete(
      req.userId,
      deletedCheckup.request,
      amount,
      deletedCheckup._id
    );
  }

  res.json(deletedCheckup);
};

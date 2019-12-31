import User from "../models/User";
import Request from "../models/Request";

export const checkupIsCreate = (
  userId: string,
  checkupAmount: number,
  requestId: string,
  checkupId: string
): void => {
  User.findById(userId, async (err, user) => {
    if (err) {
      return new Error("User not updated");
    }

    if (user) {
      user.checked += checkupAmount;
      user.requested -= checkupAmount;
      await user.save();

      Request.findById(requestId, async (err, request) => {
        if (err) {
          return new Error("Request not found");
        }

        if (request) {
          if (request.checkups.length >= 1) {
            if (checkupAmount == request.pendingAmount) {
              request.checked = true;
              request.status = "COMPROBADA";
              request.pendingAmount -= checkupAmount;
              request.checkups.push(checkupId);
              await request.save();
            }
          } else {
            if (checkupAmount == request.amount) {
              request.checked = true;
              request.status = "COMPROBADA";
              request.checkups.push(checkupId);
              await request.save();
            } else if (checkupAmount < request.amount) {
              request.checked = false;
              request.status = "SALDO PENDIENTE";
              request.pendingAmount = request.amount - checkupAmount;
              request.checkups.push(checkupId);
              await request.save();
            }
          }
        }
      });
    }
  });
};

export const checkupIsDelete = (
  userId: string,
  requestId: string,
  checkupAmount: number,
  checkupId: string
): void => {
  User.findById(userId, async (err, user) => {
    if (err) {
      return new Error("User not found");
    }

    if (user) {
      user.checked -= checkupAmount;
      user.requested += checkupAmount;
      await user.save();

      Request.findById(requestId, async (err, request) => {
        if (err) {
          return new Error("Request not found");
        }

        if (request) {
          if (request.checkups.length > 1) {
            const checkupToDelete = request.checkups.indexOf(checkupId);
            request.checkups.splice(checkupToDelete, 1);

            request.pendingAmount += checkupAmount;
            request.checked = false;
            request.status = "SALDO PENDIENTE";
            await request.save();
          } else {
            const checkupToDelete = request.checkups.indexOf(checkupId);
            request.checkups.splice(checkupToDelete, 1);

            request.pendingAmount = 0;
            request.checked = false;
            request.status = "NO COMPROBADA";
            await request.save();
          }
        }
      });
    }
  });
};

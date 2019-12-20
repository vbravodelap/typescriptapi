import User from "../models/User"
import Request from "../models/Request";

export const checkupIsCreate = (userId: string, checkupAmount: number, requestId: string, checkupId: string): void => {
    User.findById(userId, async (err, user) => {
        if(err) {
            return new Error('User not updated');
        }

        if(user) {
            user.checked += checkupAmount;
            user.requested -= checkupAmount;
            await user.save();

            Request.findById(requestId, async (err, request) => {
                if(err) {
                    return new Error('Request not found');
                }

                if(request) {
                    if(checkupAmount === request.amount) {
                        request.checked = true;
                        request.status = 'COMPROBADA';
                        request.checkups = checkupId;
                        await request.save();
                    }else if(checkupAmount < request.amount) {
                        request.checked = false;
                        request.status = 'SALDO PENDIENTE';
                        request.pendingAmount = request.amount - checkupAmount;
                        request.checkups = checkupId;
                        await request.save();
                    }
                }
            })
            
        }
    })

    
}

export const checkupIsDelete = (userId: string, requestId: string, amount: number): void => {
    Request.findById(requestId, (err, request) => {
        if(err) {
            return new Error('Checkup not found');
        }

        // Pending edit
        if(request){
            if(request.checkups.length > 1 ){
                request.status = 'SALDO PENDIENTE';
                request.checked = false;
                request.pendingAmount -= amount;
            }else{
                request.status = 'PENDIENTE';
                request.checked = false;
                request.pendingAmount -= amount;
            }

            
        }
    })
}
import User from "../models/User"

export const updateUserRequested =  (userId: string, amount: number) => {
    User.findById(userId, async (err, user) => {
        if(err){
            return new Error('User no updated');
        }
        
        if(user) {
            user.requested  += amount;
            await user.save();
        }
    })
}

import nodemailer from 'nodemailer';

export default async function createUserMail(userEmail: string, nameOfUser: string){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'tatyana73@ethereal.email',
            pass: 'mmZfZMVvJbS9N8UDYQ'
        }
    })
    
    const mailConfig = {
        from: '"Example Team" <admin@conasim.com>',
        to: 'vic.bravo4401@gmail.com',
        subject: 'Nuevo usuario registrado',
        text: `Un nuevo usuario fue registrado con el nombre de: ${nameOfUser} y su correo es: ${userEmail}`
    };

    const info = await transporter.sendMail(mailConfig);
    if(!info){
        console.log('Error al enviar el correo');
    }

    if(info) {
        console.log(info.messageId);
    }
}


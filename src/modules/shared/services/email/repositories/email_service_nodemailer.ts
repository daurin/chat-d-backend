import IEmailService, { EmailClientParams, MailDataRequired } from "../models/email_interface";
import nodemailer, { Transporter } from 'nodemailer';

export default class EmailServiceNodemailer implements IEmailService {
    transporter?: Transporter;

    initClient(params: EmailClientParams): void {
        this.transporter = nodemailer.createTransport({
            service: params.service,
            auth: {
                user: params.user,
                pass: params.password
            }
        });

    }
    send(data: MailDataRequired): void {
        this.transporter?.sendMail({
            from: data.from,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        },(err,info)=>{

        });
    }
}
import IEmailService, { EmailClientParams, MailDataRequired } from "./models/email_interface";
import EmailServiceNodemailer from "./repositories/email_service_nodemailer";

class EmailService  implements IEmailService{
    private repository:IEmailService;

    constructor() {
        this.repository=new EmailServiceNodemailer();
    }
    initClient(params: EmailClientParams): void {
        return this.repository.initClient(params);
    }
    send(data: MailDataRequired): void {
        return this.repository.send(data);
    }
}
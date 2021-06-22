import sendgrid from '@sendgrid/mail';
sendgrid.send({
    to: 'test@example.com',
    from: 'test@example.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
});

export default interface IEmailService{
    initClient(params:EmailClientParams):void;
    send(data:MailDataRequired):void;
}

export interface EmailClientParams{
    service:string;
    user: string;
    password: string;
}

export interface MailDataRequired{
    to:string;
    from:string;
    subject?:string;
    text?:string;
    html?:string;
}